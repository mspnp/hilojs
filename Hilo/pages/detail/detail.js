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

            //todo: the item.url is for the thumb, we need to retrieve the real image

            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            img.src = URL.createObjectURL(image);
            section.appendChild(img);

            var elements = document.querySelectorAll('section');
            ui.Animation.fadeIn(section);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name='element' domElement='true' />
            /// <param name='viewState' value='Windows.UI.ViewManagement.ApplicationViewState' />
            /// <param name='lastViewState' value='Windows.UI.ViewManagement.ApplicationViewState' />

            // TODO: Respond to changes in viewState.
            debugger;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    };

    pages.define('/pages/detail/detail.html', page);
    return page;
});
