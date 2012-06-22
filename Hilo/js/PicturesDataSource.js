(function (global) {
    'use strict';

    var bulk = Windows.Storage.BulkAccess,
        fp = Windows.Storage.FileProperties,
        search = Windows.Storage.Search;

    var FileStorageDataAdapter = WinJS.Class.define(function (query, options) {

        var mode = fp.ThumbnailMode.picturesView,
            minimum_size = 256,
            options = fp.ThumbnailOptions.useCurrentScale,
            delayLoad = true;

        this._loader = new bulk.FileInformationFactory(query, mode, minimum_size, options, delayLoad);
        this._query = query;
        this.compareByIdentity = false;
    }, {
        itemsFromIndex: function (index, countBefore, countAfter) {
            // don't allow more than 64 items to be retrieved at once
            if (countBefore + countAfter > 64) {
                countBefore = Math.min(countBefore, 32);
                countAfter = 64 - (countBefore + 1);
            }

            var first = (index - countBefore),
                count = (countBefore + 1 + countAfter);
            var that = this;
            function listener(ev) {
                that._notificationHandler.changed(that._item(ev.target));
            };

            return this._loader.getFilesAsync(first, count).then(function (itemsVector) {
                var vectorSize = itemsVector.size;
                if (vectorSize <= countBefore) {
                    return WinJS.Promise.wrapError(new WinJS.ErrorFromName(WinJS.UI.FetchError.doesNotExist));
                }
                var items = new Array(vectorSize);
                var localItemsVector = new Array(vectorSize);
                itemsVector.getMany(0, localItemsVector);
                for (var i = 0; i < vectorSize; i++) {
                    items[i] = that._item(localItemsVector[i]);
                    items[i].groupKey = 'June 2012';
                    localItemsVector[i].addEventListener('propertiesupdated', listener);
                }
                var result = {
                    items: items,
                    offset: countBefore,
                    absoluteIndex: index
                };
                // set the totalCount only when we know it (when we retrieived fewer items than were asked for)
                if (vectorSize < count) {
                    result.totalCount = first + vectorSize;
                }

                return result;
            });
        },

        getCount: function () {
            return this._query.getItemCountAsync();
        },

        // compareByIdentity: set in constructor
        // itemsFromStart: not implemented
        // itemsFromKey: not implemented
        // insertAtStart: not implemented
        // insertBefore: not implemented
        // insertAfter: not implemented
        // insertAtEnd: not implemented
        // change: not implemented
        // moveToStart: not implemented
        // moveBefore: not implemented
        // moveAfter: not implemented
        // moveToEnd: not implemented
        // remove: not implemented

        _item: function (item) {
            return {
                key: item.path || item.folderRelativeId,
                data: item
            };
        }
    });

    WinJS.Namespace.define('Hilo', {
        Pictures: WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function () {

            var library = Windows.Storage.KnownFolders.picturesLibrary;

            var queryOptions = new search.QueryOptions(search.CommonFileQuery.orderByDate, ['.jpg']);
            queryOptions.folderDepth = search.FolderDepth.deep;
            queryOptions.indexerOption = search.IndexerOption.useIndexerWhenAvailable;
            var query = library.createFileQueryWithOptions(queryOptions);
            this._baseDataSourceConstructor(new FileStorageDataAdapter(query));
        })
    });
})();