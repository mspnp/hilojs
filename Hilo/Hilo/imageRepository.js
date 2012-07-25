(function () {

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
        fileQuery = storage.Search.CommonFileQuery.orderByDate;

    // Private Methods
    // ---------------

    function constructor (folder) {
        this.folder = folder;
    }

    var imageRepository = {
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
    };

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo', {
        ImageRepository: WinJS.Class.define(constructor, imageRepository)
    });

})();