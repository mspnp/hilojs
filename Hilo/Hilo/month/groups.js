(function () {
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

    function toGroup(folder, index) {

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
            var self = this,
                start = Math.max(0, requestIndex - countBefore),
                count = 1 + countBefore + countAfter;

            var collectGroups;

            // First, we'll check for items in the cache
            var cached = this.fromCache(start, count, requestIndex - start);

            // If we still need items that weren't in the cache,
            // we'll setup a promise to fetch them from WinRT and
            // append them to any items we found in the cache.
            if (cached.nextCount > 0) {
                collectGroups = this.fetch(cached.nextStart, cached.nextCount)
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
            var buildResult = this.buildResult.bind(this, countBefore, start);

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
            var index = cache.byKey[key];

            return this.itemsFromIndex(index, countBefore, countAfter);
        },

        fromCache: function (start, count, offset) {
            var found = [],
                index,
                item;

            for (index = start; index <= (start + count) ; index++) {
                item = cache.byIndex[index];
                if (!item) {
                    break;
                }
                found.push(item);
            }

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

                    groups.forEach(function (group, index) {
                        //todo: filter out groups with no counts?

                        var groupIndex = start + index;
                        var nextFirstIndex = (groupIndex > 0) ? firstIndices[groupIndex - 1] : 0;
                        group.firstItemIndexHint = nextFirstIndex;
                        firstIndices[groupIndex] = group.firstItemIndexHint + group.data.count;

                        // cache by index
                        cache.byIndex[groupIndex] = group;

                        // cache by key
                        cache.byKey[group.key] = groupIndex;
                    });

                    return groups;
                });

        },

        buildResult: function (offset, absoluteIndex, items) {

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