(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        folder = storage.KnownFolders.picturesLibrary;

    // Public API
    // ----------

    WinJS.Namespace.define('Tiles', {

        getImagesForTile: function () {

            var query = storage.Search.CommonFileQuery.orderByDate,
                queryOptions = new storage.Search.QueryOptions(query, ['.jpg']);

            var queryResult = folder.createFileQuery(queryOptions);
            var factory = new storage.BulkAccess.FileInformationFactory(queryResult, storage.FileProperties.ThumbnailMode.singleItem);

            return factory.getFilesAsync(0, 5);
        }

    });
})();