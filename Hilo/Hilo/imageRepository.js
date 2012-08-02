(function () {

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        promise = WinJS.Promise,
        knownFolders = Windows.Storage.KnownFolders,
        commonFileQuery = storage.Search.CommonFileQuery,
        thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
        thumbnailSize = 1024,
        supportedFileTypes = ['.jpg', '.tiff', '.png', '.bmp'];

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
            var queryOptions = this.getQueryOptions();
            return this.getFilesFromOptions(queryOptions, 0, count);
        },

        getBindableImages: function (count) {
            return this.getImages(count).then(createViewModels);
        },

        // TODO: temp solution to keep the details page working
        getImageAt: function (index) {
            var queryOptions = this.getQueryOptions();
            queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

            return this.getFilesFromOptions(queryOptions, index, 1).then(function (files) {
                return WinJS.Promise.wrap(files[0]);
            });
        },

        getQueryForMonthAndYear: function(monthAndYear){
            var options = this.getQueryOptions();
            options.applicationSearchFilter = 'taken: ' + monthAndYear;
            return options.saveToString();
        },

        getFromQueryString: function (queryString) {
            var options = this.getQueryOptions();
            options.loadFromString(queryString);
            return this.getFilesFromOptions(options, 0, 15).then(createViewModels);
        },

        getQueryOptions: function () {
            var queryOptions = new storage.Search.QueryOptions(commonFileQuery.orderByDate, supportedFileTypes);
            queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;
            return queryOptions
        },

        getFilesFromOptions: function (queryOptions, start, count) {
            var queryResult = this.folder.createFileQueryWithOptions(queryOptions);
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