(function () {
    'use strict';

    var bulk = Windows.Storage.BulkAccess,
        fp = Windows.Storage.FileProperties,
        search = Windows.Storage.Search;

    function projectToGroup(item, count) {
        return {
            key: item.name,
            count: count,
            firstItemIndexHint: count,
            data: item
        };
    }
    //new bulk.FileInformationFactory(query, ...).getFilesAsync(first, count).then(function (itemsVector) {
    //    var vectorSize = itemsVector.size;

    //    if (vectorSize <= countBefore) {
    //        return WinJS.Promise.wrapError(new WinJS.ErrorFromName(WinJS.UI.FetchError.doesNotExist));
    //    }

    //    var localItemsVector = new Array(vectorSize);
    //    itemsVector.getMany(0, localItemsVector);

    //    var items = new Array(vectorSize);
    //    for (var i = 0; i < vectorSize; i++) {
    //
    // Groups Data Adapter
    //
    // Data adapter for the groups. Follows the same pattern as the items data adapter, but each item is a group.
    // The main concerns when creating a data adapter for groups are:
    // *  Groups can be enumerated by key or index, so the adapter needs to implement both itemsFromKey and itemsFromIndex
    // *  Each group should supply a firstItemIndexHint which is the index of the first item in the group. This enables listview
    //    to figure out the position of an item in the group so it can get the columns correct.
    //
    var dataAdapter = WinJS.Class.define(
        function () {

            var library = Windows.Storage.KnownFolders.picturesLibrary;

            var mode = fp.ThumbnailMode.picturesView,
                minimum_size = 256,
                options = fp.ThumbnailOptions.useCurrentScale,
                delayLoad = true;

            var queryOptions = new search.QueryOptions(search.CommonFolderQuery.groupByMonth);
            this._query = library.createFolderQueryWithOptions(queryOptions);
            this._loader = new bulk.FileInformationFactory(this._query, mode, minimum_size, options, delayLoad);
        },

        // Data Adapter interface methods
        // These define the contract between the virtualized datasource and the data adapter.
        // These methods will be called by virtualized datasource to fetch items, count etc.
        {
            getCount: function () {
                return this._query.getItemCountAsync();
            },

            // Called by the virtualized datasource to fetch a list of the groups based on group index
            // It will request a specific group and hints for a number of groups either side of it
            // The implementation should return the specific group, and can choose how many either side
            // to also send back. It can be more or less than those requested.
            //
            // Must return back an object containing fields:
            //   items: The array of groups of the form:
            //      [{ key: groupkey1, firstItemIndexHint: 0, data : { field1: value, field2: value, ... }}, { key: groupkey2, firstItemIndexHint: 27, data : {...}}, ...
            //   offset: The offset into the array for the requested group
            //   totalCount: (optional) an update of the count of items
            itemsFromIndex: function (index, countBefore, countAfter) {
                if (countBefore + countAfter > 64) {
                    countBefore = Math.min(countBefore, 32);
                    countAfter = 64 - (countBefore + 1);
                }

                var first = (index - countBefore),
                    count = (countBefore + 1 + countAfter);
                var that = this;

                return this._loader.getFoldersAsync(first, count).then(function (itemsVector) {
                    var vectorSize = itemsVector.size;

                    if (vectorSize <= countBefore) {
                        return WinJS.Promise.wrapError(new WinJS.ErrorFromName(WinJS.UI.FetchError.doesNotExist));
                    }

                    var localItemsVector = new Array(vectorSize);
                    itemsVector.getMany(0, localItemsVector);

                    var items = new Array(vectorSize);

                    var promises = localItemsVector.map(function (item, index) {
                        return item.createFileQuery().getItemCountAsync().then(function (count) {
                            items[index] = projectToGroup(item, count);
                        })
                    });

                    return WinJS.Promise.join(promises).then(function () {

                        var currentIndex = item[0].firstItemIndexHint;
                        items.forEach(function (item, index) {

                        });

                        var result = {
                            items: items,
                            offset: countBefore, // The offset into the array for the requested item
                            absoluteIndex: index
                        };
                        // set the totalCount only when we know it (when we retrieived fewer items than were asked for)
                        if (vectorSize < count) {
                            result.totalCount = first + vectorSize;
                        }

                        return result;
                    });
                });
            },

            // Called by the virtualized datasource to fetch groups based on the group's key
            // It will request a specific group and hints for a number of groups either side of it
            // The implementation should return the specific group, and can choose how many either side
            // to also send back. It can be more or less than those requested.
            //
            // Must return back an object containing fields:
            //   [{ key: groupkey1, firstItemIndexHint: 0, data : { field1: value, field2: value, ... }}, { key: groupkey2, firstItemIndexHint: 27, data : {...}}, ...
            //   offset: The offset into the array for the requested group
            //   absoluteIndex: the index into the list of groups of the requested group
            //   totalCount: (optional) an update of the count of items
            itemsFromKey: function (requestKey, countBefore, countAfter) {

                var index = 0;

                if (countBefore + countAfter > 64) {
                    countBefore = Math.min(countBefore, 32);
                    countAfter = 64 - (countBefore + 1);
                }

                var first = (index - countBefore),
                    count = (countBefore + 1 + countAfter);
                var that = this;
                first = 0;
                return this._loader.getFilesAsync(first, count).then(function (itemsVector) {
                    var vectorSize = itemsVector.size;

                    if (vectorSize <= countBefore) {
                        return WinJS.Promise.wrapError(new WinJS.ErrorFromName(WinJS.UI.FetchError.doesNotExist));
                    }

                    var localItemsVector = new Array(vectorSize);
                    itemsVector.getMany(0, localItemsVector);

                    var items = new Array(vectorSize);
                    for (var i = 0; i < vectorSize; i++) {
                        items[i] = (projectToGroup(localItemsVector[i], i));
                    }
                    var result = {
                        items: items,
                        offset: countBefore,// The offset into the array for the requested item
                        absoluteIndex: index
                    };
                    // set the totalCount only when we know it (when we retrieived fewer items than were asked for)
                    if (vectorSize < count) {
                        result.totalCount = first + vectorSize;
                    }

                    return result;
                });
            },

        });

    WinJS.Namespace.define('Hilo', {
        MonthGroups: WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function () {
            this._baseDataSourceConstructor(new dataAdapter());
        })
    });

})();