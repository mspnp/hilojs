(function () {
    'use strict';
    console.log('monthView loading');
    var search = Windows.Storage.Search;
    var lastSelectedIndex = -1;

    function getFileDataSource(library) {
        var queryOptions = new search.QueryOptions(search.CommonFolderQuery.groupByMonth);
        //queryOptions.folderDepth = search.FolderDepth.deep;
        //queryOptions.indexerOption = search.IndexerOption.useIndexerWhenAvailable;
        var query = library.createFolderQueryWithOptions(queryOptions);
        return new WinJS.UI.StorageDataSource(query, queryOptions);
    }

    WinJS.UI.Pages.define('/pages/monthView/monthView.html', {
        ready: function (element, options) {
            console.log('monthView ready');

            var library = Windows.Storage.KnownFolders.picturesLibrary;

            var lv = document.querySelector('#basicListView').winControl;
            lv.layout = new WinJS.UI.GridLayout();
            lv.itemDataSource = new Hilo.Pictures();
            lv.groupDataSource = new Hilo.MonthGroups();

            lv.itemTemplate = function (promise) {
                return promise.then(function (item) {
                    var div = document.createElement('div');

                    if (!item || !item.data || !item.data.thumbnail) {
                        console.log('something was missing');
                        return div;
                    }

                    div.innerText = item.data.displayName;

                    return div;
                });
            };
            lv.groupHeaderTemapte = function () {
                debugger;
            };

            lv.oniteminvoked = function (evt) {

                lastSelectedIndex = evt.detail.itemIndex;

                evt.detail.itemPromise.then(function (item) {
                    WinJS.Navigation.navigate('/pages/detail/detail.html', item.data);
                });
            };

            if (lastSelectedIndex > -1) {
                lv.indexOfFirstVisible = lastSelectedIndex;
            }
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name='element' domElement='true' />
            /// <param name='viewState' value='Windows.UI.ViewManagement.ApplicationViewState' />
            /// <param name='lastViewState' value='Windows.UI.ViewManagement.ApplicationViewState' />

            // TODO: Respond to changes in viewState.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    });
})();
