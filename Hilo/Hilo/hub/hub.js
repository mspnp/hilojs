(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState,
        ui = WinJS.UI,
        nav = WinJS.Navigation,
        pages = WinJS.UI.Pages;

    // These settings must correspond to the height and width values specified 
    // in the css for the items. They need to be the greatest common demoninator
    // of the various widths and heights.
    var listViewLayoutSettings = {
        enableCellSpanning: true,
        cellWidth: 200,
        cellHeight: 200
    };

    var lv,
        appbar,
        buttons,
        page;

    //TODO: temporary implementation
    var commands = {
        rotate: function () {
            var indices = lv.selection.getIndices();
            nav.navigate('/Hilo/rotate/rotate.html', indices[0]);
        },
        crop: function () {
            var indices = lv.selection.getIndices();
            nav.navigate('/Hilo/crop/crop.html', indices[0]);
        }
    };

    // Private Methods
    // ---------------

    function setupAppbar() {
        appbar = document.querySelector('#appbar').winControl;
        buttons = document.querySelectorAll('#appbar button');

        Array.prototype.forEach.call(buttons, function (x) {
            x.addEventListener('click', function (args) {
                commands[args.currentTarget.id]();
            });
        });
    }

    function setupListView() {
        lv = document.querySelector('#picturesLibrary').winControl;

        lv.layout = selectLayout(Windows.UI.ViewManagement.ApplicationView.value);

        lv.addEventListener('iteminvoked', imageNavigated);
        lv.addEventListener('selectionchanged', imageSelected);
    }

    function imageSelected(args) {

        var indices = lv.selection.getIndices();

        Array.prototype.forEach.call(buttons, function (x) {
            x.winControl.disabled = (indices.length === 0);
        });

        if (indices.length !== 0) {
            appbar.show();
        } else {
            appbar.hide();
        };
    }

    function imageNavigated(args) {
        nav.navigate('/Hilo/detail/detail.html', args.detail.itemIndex);
    }

    function bindImages(items) {

        if (items.length > 0) {
            items[0].className = items[0].className + ' first';
        }

        lv.itemDataSource = new WinJS.Binding.List(items).dataSource;
    }

    function animateEnterPage() {
        var elements = document.querySelectorAll('.titlearea, section[role=main]');
        ui.Animation.enterPage(elements);
    }

    function selectLayout(viewState, lastViewState) {

        if (lastViewState === viewState) return;

        if (viewState === appViewState.snapped) {
            return new WinJS.UI.ListLayout();
        }
        else {
            var layout = new WinJS.UI.GridLayout();
            layout.groupInfo = function () { return listViewLayoutSettings };
            layout.maxRows = 3;
            return layout;
        }
    }

    page = {
        ready: function (element, options) {

            WinJS.Resources.processAll();

            setupListView();
            setupAppbar();

            new Hilo.ImageRepository(Windows.Storage.KnownFolders.picturesLibrary).getBindableImages(6)
                .then(bindImages)
                .then(animateEnterPage);

        },

        updateLayout: function (element, viewState, lastViewState) {
            lv.layout = selectLayout(viewState);
        },

        unload: function () {
            // TODO: 
        }
    };

    // Public API
    // ----------
    pages.define('/Hilo/hub/hub.html', page);

}());