(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var knownFolders = Windows.Storage.KnownFolders;
    var propertyPrefetchOptions = Windows.Storage.FileProperties.PropertyPrefetchOptions,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode.singleItem,
        thumbnailOptions = Windows.Storage.FileProperties.ThumbnailOptions,
        thumbnailSize = 256,
        commonFolderQuery = Windows.Storage.Search.CommonFolderQuery,
        supportedFileTypes = ['.jpg', '.tiff', '.png', '.bmp'];

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Private Methods
    // ---------------

    var cache = {
        byIndex: [],
        byKey: {}
    };

    var firstIndices = [];

    function getGroupKeyFor(folder) {
        return folder.name.replace(/\u200E/g, '');
    }

    function toGroup(folder, index) {

        //TODO: this query needs a filter
        var getCount = folder.createItemQuery().getItemCountAsync();
        //var getCount = folder.createItemQueryWithOptions().getItemCountAsync();

        return getCount.then(function (count) {

            var result = {
                key: getGroupKeyFor(folder),
                firstItemIndexHint: null, // we need to set this later
                data: {
                    title: folder.name,
                    count: count
                },
            };

            return result;
        });
    }

    var DataAdapter = WinJS.Class.define(function () {
        var queryOptions = new Windows.Storage.Search.QueryOptions(commonFolderQuery.groupByMonth);
        this.query = knownFolders.picturesLibrary.createFolderQueryWithOptions(queryOptions);
        this.totalCount;
    }, {
        itemsFromIndex: function (requestIndex, countBefore, countAfter) {
            var self = this,
                start = Math.max(0, requestIndex - countBefore),
                count = 5 + countBefore + countAfter;

            // TODO: can we retrieve these from a cache instead of querying the file system again?
            //var cached = cache.byIndex[requestIndex];
            //if (cached) {
            //    return WinJS.Promise.as({
            //        items: [cached],
            //        offset: 0,
            //        absoluteIndex: requestIndex
            //    });
            //}

            return this.query.getFoldersAsync(start, count)
                .then(function (folders) {
                    return WinJS.Promise.join(folders.map(toGroup));
                })
                .then(function (groups) {

                    groups.forEach(function (group, index) {
                            
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
                })
                .then(function (items) {

                    var result = {
                        items: items,
                        offset: requestIndex - start,
                        absoluteIndex: start
                    };

                    if (self.totalCount) {
                        result.totalCount = self.totalCount;
                    }

                    return result;
                });
        },

        getCount: function () {
            var self = this;
            return this.query.getItemCountAsync().then(function (count) {
                self.totalCount = count;
                return count;
            });
        },

        itemsFromKey: function (key, countBefore, countAfter) {
            var index = cache.byKey[key];
            if (!index) {
                // NOTE: it is possible that a group may be requested by key before it is 
                // ever requested by index. I believe this happens when an item from the 
                // group is retrieved before the group has been retrieved.
                debugger;
            }
            return this.itemsFromIndex(index, countBefore, countAfter);
        }
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