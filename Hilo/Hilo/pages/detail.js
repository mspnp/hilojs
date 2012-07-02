define('Hilo.pages.detail', function (require) {
    'use strict';

    var // WinJS
        ui = require('WinJS.UI'),
        nav = require('WinJS.Navigation'),
        pages = require('WinJS.UI.Pages');

    var // WindowsRT
        bulk = require('Windows.Storage.BulkAccess'),
        storage = require('Windows.Storage'),
        library = require('Windows.Storage.KnownFolders.picturesLibrary'),
        search = require('Windows.Storage.Search'),
        promise = require('WinJS.Promise');

    var // query configuration
        mode = storage.FileProperties.ThumbnailMode.singleItem,
        minimum_size = 310,
        options = storage.FileProperties.ThumbnailOptions.none,
        delayLoad = true,
        // query setup
        queryOptions = new search.QueryOptions(search.CommonFileQuery.orderByDate, ['.jpg']),
        query = library.createFileQueryWithOptions(queryOptions),
        access = new bulk.FileInformationFactory(query, mode, minimum_size, options, delayLoad);

    var page = {

        ready: function (element, image) {

            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            section.appendChild(img);
            //img.src = URL.createObjectURL(image);
            img.addEventListener('load', function () {
                ui.Animation.fadeIn(img);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    pages.define('/Hilo/pages/detail.html', page);
    return page;
});
