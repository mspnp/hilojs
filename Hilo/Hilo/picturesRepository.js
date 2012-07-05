define('Hilo.PicturesRepository', function (require) {
    'use strict';

    var // dependencies
        bulk = require('Windows.Storage.BulkAccess'),
        storage = require('Windows.Storage'),
        library = require('Windows.Storage.KnownFolders.picturesLibrary'),
        search = require('Windows.Storage.Search'),
        promise = require('WinJS.Promise');

    var Picture = require('Hilo.Picture');

    var // constants
        imageCount = 6;

    var // query configuration
        mode = storage.FileProperties.ThumbnailMode.singleItem,
        minimum_size = 310,
        options = storage.FileProperties.ThumbnailOptions.none,
        delayLoad = true,
        // query setup
        queryOptions = new search.QueryOptions(search.CommonFileQuery.orderByDate, ['.jpg']),
        query = library.createFileQueryWithOptions(queryOptions),
        access = new bulk.FileInformationFactory(query, mode, minimum_size, options, delayLoad);

    function createViewModels(files) {
        return promise.wrap(files.map(Picture.from));
    }

    return {
        getPreviewImages: function () {
            return access.getFilesAsync(0, imageCount).then(createViewModels);
        },
        // TODO: temp solution to keep the details page working
        getImageAt: function (index) {
            return access.getFilesAsync(index, 1).then(function (files) {
                return promise.wrap(files[0]);
            });
        }
    };
});