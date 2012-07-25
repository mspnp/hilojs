(function () {

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        promise = WinJS.Promise,
        thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
        fileQuery = storage.Search.CommonFileQuery.orderByDate;

    // Private Methods
    // ---------------

    function constructor (folder) {
        this.folder = folder;
    }

    function createViewModels(files) {
        return promise.wrap(files.map(Hilo.Picture.from));
    }

    var imageRepository = {
        getImages: function (count) {
            var folder = this.folder;

            var queryOptions = new storage.Search.QueryOptions(fileQuery, ['.jpg', '.tiff', '.png', '.bmp']);
            queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

            var queryResult = folder.createFileQueryWithOptions(queryOptions);

            var factory = new storage.BulkAccess.FileInformationFactory(queryResult, thumbnailMode);

            return factory.getFilesAsync(0, count);
        },

        getBindableImages: function (count) {
            return this.getImages(count).then(createViewModels);
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo', {
        ImageRepository: WinJS.Class.define(constructor, imageRepository)
    });

})();