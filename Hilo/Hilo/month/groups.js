// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var search = Windows.Storage.Search,
        commonFolderQuery = Windows.Storage.Search.CommonFolderQuery;

    // Private Methods
    // ---------------

    // Given an array of files, retrieve the itemDate for the first 
    // file in the array.
    function retrieveFirstItemDate(files) {
        var next;

        if (files.length > 0) {

            // If the array contains at least one file, then we want to
            // retrieve the itemDate from that file.
            next = files[0].properties
                .retrievePropertiesAsync(["System.ItemDate"])
                .then(function (retrieved) {
                    return retrieved.lookup("System.ItemDate");
                });

        } else {

            // However, if there are no files in the array, we still need to
            // return something. We'll return an arbitrary date value. We 
            // don't expect the value to be used though becaue empty groups
            // should not be added to list view.
            next = WinJS.Promise.as(new Date(1900, 1));
        }

        return next;
    }

    var DataAdapter = WinJS.Class.define(function (queryBuilder, folder, dateFormatter) {

        // The query builder doesn't currently support the folder query. Since this is
        // an entirely different base for the query and since this is the only place in 
        // in the application where it is needed, we did not folder it back into the
        // query builder.
        var queryOptions = new search.QueryOptions(commonFolderQuery.groupByMonth);
        this.query = folder.createFolderQueryWithOptions(queryOptions);
        this.queryBuilder = queryBuilder;

        // We expect this function to return world-ready value from the month and year
        // separated by a space.
        this._dateFormatter = dateFormatter;

        // We'll cache the total number of month groups whenever
        // `getCount` is called, then we can provide the value 
        // in the result of `itemsFromIndex`.
        this.totalCount = null;

        // We cache various bits data about the month groups
        // so that we won't have to go back the file system
        // over and over again.
        this.cache = {
            byIndex: [],
            byKey: {},
            firstIndices: []
        };
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
            // We also need to confirm that we are not requesting items
            // beyond the total count. Without this check, we would occasionally
            // and in an unpredictable way end up calling `itemsFromIndex`
            // too many time (with significant performance impact).
            if (cached.nextCount > 0 && (!this.totalCount || cached.nextCount < this.totalCount)) {

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
            var index = this.cache.byKey[key];
            if (index === undefined) {
                index = this.cache.byIndex.length;
            }
            return this.itemsFromIndex(index, countBefore, countAfter);
        },

        fromCache: function (start, count, offset) {
            var found = [],
                index,
                item;

            // Locate the items in the cache
            for (index = start; index < (start + count) ; index++) {
                item = this.cache.byIndex[index];
                // As soon as we hit an index that is not 
                // present in the cache, we exit the loop
                if (!item) {
                    break;
                }
                found.push(item);
            }
            if (isNaN(start)) { debugger; }
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
            var self = this;
            var convert = this.toListViewHeaderGroup.bind(this);

            // caches
            var firstIndices = self.cache.firstIndices
            var byIndex = self.cache.byIndex;
            var byKey = self.cache.byKey;

            return this.query
                .getFoldersAsync(start, count)
                .then(function (folders) {
                    return WinJS.Promise.join(folders.map(convert));
                })
                .then(function (groups) {

                    return groups
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
                            byIndex[groupIndex] = group;

                            // Cache the index of the group by its key.
                            byKey[group.key] = groupIndex;

                            return group;
                        });
                });

        },

        toListViewHeaderGroup: function (folder) {

            var query = this.queryBuilder.build(folder);

            var getCount = query.fileQuery.getItemCountAsync();

            var getFirstFileItemDate = query.fileQuery
                .getFilesAsync(0, 1)
                .then(retrieveFirstItemDate);

            return WinJS.Promise
                .join([getCount, getFirstFileItemDate])
                .then(this.builldMonthGroupResult.bind(this));
        },

        buildResult: function (offset, absoluteIndex, items) {
            // Package the data in a format that the consuming 
            // control (a list view) can process.
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

        builldMonthGroupResult: function (values) {

            var count = values[0],
                        firstItemDate = values[1];

            var month = this._dateFormatter.getMonthFrom(firstItemDate);
            var year = this._dateFormatter.getYearFrom(firstItemDate);

            // TODO: The way we are handling zero count groups
            // is a temporary solution
            var result = {
                key: Hilo.month.groupKeyFromDate(firstItemDate),
                firstItemIndexHint: 0, // we need to set this later
                data: {
                    title: month + "&nbsp;" + year,
                    count: count
                },
                groupKey: year
            };

            return result;
        },

        getGroupByKey: function (groupKey) {
            var self = this;
            var groupIndex = this.cache.byKey[groupKey];

            if (!groupIndex) {

                return self.getCount()
                    .then(function () {
                        var nextIndex = self.cache.byIndex.length;
                        var remaining = self.totalCount - self.cache.byIndex.length;
                        return self.fetch(nextIndex, remaining)
                    })
                    .then(function () {
                        return self.getGroupByKey(groupKey);
                    });

            } else {
                var group = this.cache.byIndex[groupIndex];
                return WinJS.Promise.as(group);
            }
        },

    });

    var Groups = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function (queryBuilder, folder, dateFormatter) {
        this.adapter = new DataAdapter(queryBuilder, folder, dateFormatter);
        this._baseDataSourceConstructor(this.adapter);

        this.getGroupByKey = this.getGroupByKey.bind(this);
    }, {
        getGroupByKey: function (groupKey) {
            return this.adapter.getGroupByKey(groupKey);
        }
    });

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.month', {
        GroupsDataAdapter: DataAdapter,
        Groups: Groups
    });

})();