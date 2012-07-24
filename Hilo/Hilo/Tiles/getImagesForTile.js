(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        folder = storage.KnownFolders.picturesLibrary,
        orderByDate = storage.Search.CommonFileQuery.orderByDate;

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {

        getImagesForTile: function () {

            var queryOptions = new storage.Search.QueryOptions(orderByDate, ['.jpg']);

            var queryResult = folder.createFileQuery(queryOptions);
            var factory = new storage.BulkAccess.FileInformationFactory(queryResult, storage.FileProperties.ThumbnailMode.singleItem);

            return factory.getFilesAsync(0, 5);
        }

    });
})();