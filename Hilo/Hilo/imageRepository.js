(function () {

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        promise = WinJS.Promise,
        knownFolders = Windows.Storage.KnownFolders,
        fileQuery = storage.Search.CommonFileQuery.orderByDate,
        thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
        thumbnailSize = 1024;

    // Private Methods
    // ---------------

    function ImageRepository (folder) {
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

            return this.getFilesFromOptions(queryOptions, 0, count);
        },

        getBindableImages: function (count) {
            return this.getImages(count).then(createViewModels);
        },

        // TODO: temp solution to keep the details page working
        getImageAt: function (index) {

            var folder = this.folder;

            var queryOptions = new storage.Search.QueryOptions(fileQuery, ['.jpg', '.tiff', '.png', '.bmp']);
            queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

            return this.getFilesFromOptions(queryOptions, index, 1).then(function (files) {
                return WinJS.Promise.wrap(files[0]);
            });
        },

        getFromOptionsString: function (queryOptionsString) {
            var options = new storage.Search.QueryOptions();
            options.loadFromString(queryOptionsString);
            return this.getFilesFromOptions(options, 0, 15).then(function (files) {
                debugger;
            });
        },

        getFilesFromOptions: function (queryOptions, start, count) {
            var queryResult = knownFolders.picturesLibrary.createFileQueryWithOptions(queryOptions);
            var factory = new storage.BulkAccess.FileInformationFactory(queryResult, thumbnailMode.singleItem, thumbnailSize);
            return factory.getFilesAsync(start, count);
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo', {
        ImageRepository: WinJS.Class.define(ImageRepository, imageRepository)
    });

})();