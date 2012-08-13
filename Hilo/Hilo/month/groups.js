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

    function getKeyFor(folder) {
        return folder.name.replace(/\u200E/g, '');
    }

    function getGroupKeyFor(folder) {
        // Extract just the year for grouping on the semantic zoom.
        return folder.name.split(' ')[1];
    }

    function toGroup(folder, index) {

        //TODO: this query needs a filter
        var getCount = folder.createItemQuery().getItemCountAsync();
        //var getCount = folder.createItemQueryWithOptions().getItemCountAsync();

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
        var queryOptions = new Windows.Storage.Search.QueryOptions(commonFolderQuery.groupByMonth);
        this.query = knownFolders.picturesLibrary.createFolderQueryWithOptions(queryOptions);
        this.totalCount;
    }, {
        itemsFromIndex: function (requestIndex, countBefore, countAfter) {
            var self = this,
                start = Math.max(0, requestIndex - countBefore),
                count = 1 + countBefore + countAfter;

            var cached = cache.byIndex[start];
            if (cached) {
                return this.fromCache(start, count, requestIndex - start);
            }

            var buildResult = this.buildResult.bind(this);

            return this.fetch(start, count)
                .then(buildResult);
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

            return this.itemsFromIndex(index, countBefore, countAfter);
        },

        fromCache: function (start, count, offset) {
            var found = [];
            var index;
            var item;
            var self = this;

            for (index = start; index <= (start + count) ; index++) {
                item = cache.byIndex[index];
                if (!item) {
                    break;
                }
                found.push(item);
            }

            if (found.length != count) {
                var nextStart = start + found.length;
                var nextCount = count - found.length;
                return this.fetch(nextStart, nextCount).then(function (groups) {
                    found.concat(groups);
                    return self.buildResult(found, offset, start);
                });
            }

            return self.buildResult(found, offset, start);
        },

        fetch: function (start, count) {
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
                });

        },

        buildResult: function (items, offset, absoluteIndex) {

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