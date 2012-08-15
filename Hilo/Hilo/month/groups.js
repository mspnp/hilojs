﻿(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var search = Windows.Storage.Search,
        knownFolders = Windows.Storage.KnownFolders,
        commonFolderQuery = Windows.Storage.Search.CommonFolderQuery;

    // Private Methods
    // ---------------

    var cache = {
        byIndex: [],
        byKey: {}
    };

    var firstIndices = [];

    //todo: improve
    function getKeyFor(folder) {
        return folder.name.replace(/\u200E/g, '');
    }

    function getGroupKeyFor(folder) {
        // Extract just the year for grouping on the semantic zoom.
        return folder.name.split(' ')[1];
    }

    function toGroup(folder) {

        // todo: can we pass in the ImageQueryBuilder?
        // and provide the folder when we call build?
        var queryBuilder = new Hilo.ImageQueryBuilder(folder);

        var query = queryBuilder.build();
        var getCount = query.fileQuery.getItemCountAsync();

        return getCount.then(function (count) {

            var result = {
                key: getKeyFor(folder),
                firstItemIndexHint: null, // we need to set this later
                data: {
                    title: folder.name,
                    count: count
                },
                groupKey: getGroupKeyFor(folder)
            };

            return result;
        });
    }

    var DataAdapter = WinJS.Class.define(function () {

        // The query builder doesn't currently support the folder query. Since this is
        // an entirely different base for the query and since this is the only place in 
        // in the application where it is needed, we did not folder it back into the
        // query builder.
        var queryOptions = new search.QueryOptions(commonFolderQuery.groupByMonth);
        this.query = knownFolders.picturesLibrary.createFolderQueryWithOptions(queryOptions);

        this.totalCount;
    }, {

        itemsFromIndex: function (requestIndex, countBefore, countAfter) {

            var start = Math.max(0, requestIndex - countBefore),
                count = 1 + countBefore + countAfter,
                offset = requestIndex - start;

            var collectGroups;

            // First, we'll check for items in the cache
            var cached = this.fromCache(start, count, offset);

            // If we still need items that weren't in the cache,
            // we'll setup a promise to fetch them from WinRT and
            // append them to any items we found in the cache.
            if (cached.nextCount > 0) {

                collectGroups = this
                    .fetch(cached.nextStart, cached.nextCount)
                    .then(function (groups) {
                        return WinJS.Promise.as(cached.items.concat(groups));
                    });

            } else {

                // If everything we needed was just in the cache, we'll
                // simply wrap that in a promise without querying the
                // file system.
                collectGroups = WinJS.Promise.as(cached.items);
            }

            // Finally, we'll take the items we collected and build a result that
            // the list view understands.
            var buildResult = this.buildResult.bind(this, offset, start);

            return collectGroups.then(buildResult);
        },

        getCount: function () {
            var self = this;
            return this.query
                .getItemCountAsync()
                .then(function (count) {
                    self.totalCount = count;
                    return count;
                });
        },

        itemsFromKey: function (key, countBefore, countAfter) {
            // Look up the index in the cache for the given key,
            // and then delegate back to `itemsFromIndex`.
            var index = cache.byKey[key];

            return this.itemsFromIndex(index, countBefore, countAfter);
        },

        fromCache: function (start, count, offset) {
            var found = [],
                index,
                item;

            // Locate the items in the cache
            for (index = start; index <= (start + count) ; index++) {
                item = cache.byIndex[index];
                // As soon as we hit an index that is not 
                // present in the cache, we exit the loop
                if (!item) {
                    break;
                }
                found.push(item);
            }

            // In addition to returning the items from the cache,
            // we also include some meta data about what was _not_
            // found in the cache.
            return {
                items: found,
                nextStart: start + found.length,
                nextCount: count - found.length
            }
        },

        fetch: function (start, count) {
            return this.query
                .getFoldersAsync(start, count)
                .then(function (folders) {
                    return WinJS.Promise.join(folders.map(toGroup));
                })
                .then(function (groups) {

                    return groups
                        //.filter(function (group) {
                        //    return group.data.count > 0;
                        //})
                        .map(function (group, index) {
                            // For each group we need to determine the index of
                            // its first item in the `picturesLibrary` as a whole.

                            // The `index` here is an offest from the `start`.
                            var groupIndex = start + index;

                            // If this the first group, then we know the first item index is 0.
                            // Otherwise, we grab the value that was calculate on the _previous_
                            // iteration.
                            var nextFirstIndex = (groupIndex === 0) ? 0 : firstIndices[groupIndex - 1];
                            group.firstItemIndexHint = nextFirstIndex;

                            // Now we calculate the first item index of the _next_ group.
                            firstIndices[groupIndex] = group.firstItemIndexHint + group.data.count;

                            // Cache the group itself by its index.
                            cache.byIndex[groupIndex] = group;

                            // Cache the index of the group by its key.
                            cache.byKey[group.key] = groupIndex;

                            return group;
                        });
                });

        },

        buildResult: function (offset, absoluteIndex, items) {
            // Package the data in a format that the 
            // consuming control (a list view) can
            // process.
            var result = {
                items: items,
                offset: offset,
                absoluteIndex: absoluteIndex
            };

            if (this.totalCount) {
                result.totalCount = this.totalCount;
            }

            return WinJS.Promise.as(result);
        },
    });

    var Groups = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function () {
        this._baseDataSourceConstructor(new DataAdapter());
    });

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.month', {
        Groups: Groups
    });

})();