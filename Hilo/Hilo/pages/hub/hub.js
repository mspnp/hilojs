define('Hilo.pages.hub', function (require) {
    'use strict';

    var // Windows
        appViewState = Windows.UI.ViewManagement.ApplicationViewState,
        // WinJS
        ui = require('WinJS.UI'),
        nav = require('WinJS.Navigation'),
        pages = require('WinJS.UI.Pages'),
        // Hilo
        repo = require('Hilo.PicturesRepository');

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
            nav.navigate('/Hilo/pages/rotate/rotate.html', indices[0]);
        },
        crop: function () {
            var indices = lv.selection.getIndices();
            nav.navigate('/Hilo/pages/crop/crop.html', indices[0]);
        }
    };

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
        nav.navigate('/Hilo/pages/detail/detail.html', args.detail.itemIndex);
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

    // Construct the page object that we want to export.
    // We store it as a variable before exporting, because we have to 
    // register the page with the url using `define`.
    page = {
        ready: function (element, options) {

            WinJS.Resources.processAll();

            setupListView();
            setupAppbar();

            repo.getPreviewImages()
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

    pages.define('/Hilo/pages/hub/hub.html', page);
    return page;
});