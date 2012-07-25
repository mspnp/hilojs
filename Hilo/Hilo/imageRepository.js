(function () {

    var storage = Windows.Storage,
        thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
        fileQuery = storage.Search.CommonFileQuery.orderByDate;

    WinJS.Namespace.define('Hilo', {
        ImageRepository: WinJS.Class.define(function (folder) {
            this.folder = folder;
        },
        {
            getImages: function (count) {
                var folder = this.folder;

                var queryOptions = new storage.Search.QueryOptions(fileQuery, ['.jpg', '.tiff', '.png', '.bmp']);
                queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

                var wat = folder.areQueryOptionsSupported(queryOptions);
                var wut = folder.isCommonFileQuerySupported(fileQuery);

                var queryResult = folder.createFileQueryWithOptions(queryOptions);

                var factory = new storage.BulkAccess.FileInformationFactory(queryResult, thumbnailMode);

                return factory.getFilesAsync(0, count);
            }
        })
    });

})();