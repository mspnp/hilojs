// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    // Imports And Constants
    // ---------
    var storage = Windows.Storage,
        promise = WinJS.Promise,
        thumbnailMode = storage.FileProperties.ThumbnailMode,
        knownFolders = Windows.Storage.KnownFolders;

    // Private Methods
    // ---------------
    function interim_solution() {
        var folder = knownFolders.picturesLibrary;
        var byMonth = storage.Search.CommonFolderQuery.groupByMonth;

        var queryOptions = new storage.Search.QueryOptions(byMonth);
        queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

        var queryResult = folder.createFolderQueryWithOptions(queryOptions);

        var sds = new WinJS.UI.StorageDataSource(queryResult, {
            mode: thumbnailMode.picturesView,
            requestedThumbnailSize: 256,
            thumbnailOptions: storage.FileProperties.ThumbnailOptions.none,
            synchronous: false
        });

        var listview = document.querySelector('#monthgroup').winControl;
        listview.itemDataSource = sds;
        listview.itemTemplate = function (itemPromise, recycledElement) {
            var element = recycledElement || document.createElement('div');

            return itemPromise.then(function (item) {
                var label = document.createElement('div');
                label.innerText = item.data.name;
                label.className = 'groupLabel';
                element.appendChild(label);

                element.style.backgroundColor = 'gray';
                element.style.width = '200px';
                element.style.height = '200px';

                return element;
            });
        };
        listview.addEventListener('iteminvoked', fakingTheQuery);
    }

    function fakingTheQuery(args) {
        args.detail.itemPromise.then(function (item) {
            var options = new storage.Search.QueryOptions(storage.Search.CommonFileQuery.orderByDate, ['.jpg', '.tiff', '.png', '.bmp']);
            options.applicationSearchFilter = 'taken: ' + item.data.name;

            var query = options.saveToString();
            var selected = 0; // pretend we selected the first image in the result set

            WinJS.Navigation.navigate('/Hilo/detail/detail.html', { query: query, selected: selected });

            // here's how we could execute this query to get the images
            //var options = new storage.Search.QueryOptions();
            //options.loadFromString(query);
            //var queryResult = knownFolders.picturesLibrary.createFileQueryWithOptions(options);
            //var factory = new storage.BulkAccess.FileInformationFactory(queryResult, thumbnailMode.singleItem);
            //return factory.getFilesAsync(0, 15).then(function (files) {
            //    debugger;
            //});

       
        });
    }

    // Public API
    // ----------
    var page = {
        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            interim_solution();
        },

        updateLayout: function (element, viewState, lastViewState) {
        },

        unload: function () {
        }
    };

    WinJS.UI.Pages.define("/Hilo/month/month.html", page);
})();
