(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var knownFolders = Windows.Storage.KnownFolders;
    var commonFileQuery = Windows.Storage.Search.CommonFileQuery;

    var propertyPrefetchOptions = Windows.Storage.FileProperties.PropertyPrefetchOptions,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode,
        thumbnailOptions = Windows.Storage.FileProperties.ThumbnailOptions,
        thumbnailSize = 128;

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Private Methods
    // ---------------

    function toListViewItem(vm) {
        var monthAndYear = monthNames[vm.itemDate.getMonth()] + ' ' + vm.itemDate.getFullYear();
        return {
            key: vm.name,
            data: vm,
            groupKey: monthAndYear
        };
    }

    var DataAdapter = WinJS.Class.define(function () {
        var queryOptions = new Windows.Storage.Search.QueryOptions(commonFileQuery.orderByDate, [".jpg", ".jpeg", ".tiff", ".png", ".bmp", ".gif"]);
        queryOptions.setPropertyPrefetch(propertyPrefetchOptions.basicProperties, ['System.ItemDate']);
        //queryOptions.setThumbnailPrefetch(thumbnailMode.singleItem, thumbnailSize, thumbnailOptions.none);

        this.query = knownFolders.picturesLibrary.createFileQueryWithOptions(queryOptions);

        this.totalCount;
    }, {
        itemsFromIndex: function (requestIndex, countBefore, countAfter) {
            var self = this;
            var start = requestIndex - countBefore
            var count = 1 + countBefore + countAfter;
            if (start < 0) {
                //count -= start;
                //start = 0;
                debugger;
            }

            return this.query.getFilesAsync(start, count).then(function (files) {
                var vm = WinJS.Promise.as().then(function () {
                    var result = files.map(Hilo.Picture.from)
                    return result;
                });
                return vm;
            }).then(function (vm) {
                var result = {
                    items: vm.map(toListViewItem),
                    offset: countBefore,
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
        }
    });

    var Members = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function () {
        this._baseDataSourceConstructor(new DataAdapter());
    });

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.month', {
        Members: Members
    });

})();