(function () {
    'use strict';

    WinJS.Namespace.define('Tiles', {

        getImagesForTile: function () {

            var storage = Windows.Storage;
            var query = storage.Search.CommonFileQuery.orderByDate;
            var queryOptions = new storage.Search.QueryOptions(query, ['.jpg']);
            var folder = storage.KnownFolders.picturesLibrary;
            var queryResult = folder.createFileQuery(queryOptions);
            var factory = new storage.BulkAccess.FileInformationFactory(queryResult, storage.FileProperties.ThumbnailMode.singleItem);

            return factory.getFilesAsync(0, 5);
        }

    });
})();