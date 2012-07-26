(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState,
        appView = Windows.UI.ViewManagement.ApplicationView,
        knownFolders = Windows.Storage.KnownFolders,
        nav = WinJS.Navigation;

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
        buttons;

    // Private Methods
    // ---------------

    var appbarBuilder = {
        setup: function () {
            this.appbar = document.querySelector('#appbar').winControl;
            var buttons = document.querySelectorAll('#appbar button');
            var that = this;

            Array.prototype.forEach.call(buttons, function (x) {
                x.addEventListener('click', function (args) {
                    that.dipatchEvent(args.currentTarget.id);
                });
            });
        },

        show: function () {
            this.appbar.show();
        },

        hide: function () {
            this.appbar.hide();
        },

        dispatchEvent: function (type, args) {
            this[type](args);
        },

        addEventListener: function (type, handler) {
            this[type] = handler;
        }
    };

    var listViewBuilder = {

        setup: function () {
            lv = document.querySelector('#picturesLibrary').winControl;

            lv.layout = this.selectLayout(appView.value);

            lv.addEventListener('iteminvoked', this.imageNavigated);
            lv.addEventListener('selectionchanged', this.imageSelected);
        },

        selectLayout: function (viewState, lastViewState) {

            if (lastViewState === viewState) { return; }

            if (viewState === appViewState.snapped) {
                return new WinJS.UI.ListLayout();
            }
            else {
                var layout = new WinJS.UI.GridLayout();
                layout.groupInfo = function () { return listViewLayoutSettings; };
                layout.maxRows = 3;
                return layout;
            }
        },

        getIndices: function () {
            lv.selection.getIndices();
        },

        imageSelected: function (args) {
            this.dispatchEvent("selectionChanged", args);
        },

        imageNavigated: function (args) {
           this.dispatchEvent("itemInvoked", args);
        },

        dispatchEvent: function (type, args) {
            this[type](args);
        },

        addEventListener: function (type, handler) {
            this[type] = handler;
        }
    };

    var mediator = WinJS.Class.define(function (appbar, listview) {
        this.listview = listview;
        this.appbar = appbar;

        appbar.addEventListener("rotate", this.rotateClicked);
        appbar.addEventListener("crop", this.cropClicked);
        listView.addEventListener("selectionChanged", this.selectionChanged);
        listView.addEventListener("itemInvoked", this.itemClicked);

    }, {

        run: function () {
            this.listview.setup();
            this.appbar.setup();
        },

        rotateClicked: function () {
            var indices = this.listview.getIndices();
            WinJS.Navigation.navigate('/Hilo/rotate/rotate.html', indices[0]);
        },

        cropClicked: function () {
            var indices = this.listview.getIndices();
            WinJS.Navigation.navigate('/Hilo/crop/crop.html', indices[0]);
        },

        selectionChanged: function (args) {
            var indices = this.listview.getIndices();

            Array.prototype.forEach.call(buttons, function (x) {
                x.winControl.disabled = (indices.length === 0);
            });

            if (indices.length !== 0) {
                appbar.show();
            } else {
                appbar.hide();
            }
        },

        itemClicked: function (args) {
            nav.navigate('/Hilo/detail/detail.html', args.detail.itemIndex);
        }
    });

    var page = {
        ready: function (element, options) {

            WinJS.Resources.processAll();

            new mediator(appbarBuilder, listViewBuilder).run();

            new Hilo.ImageRepository(knownFolders.picturesLibrary)
                .getBindableImages(6)
                .then(this.bindImages)
                .then(this.animateEnterPage);
        },

        updateLayout: function (element, viewState, lastViewState) {
            lv.layout = listViewBuilder.selectLayout(viewState);
        },

        bindImages: function (items) {

            if (items.length > 0) {
                items[0].className = items[0].className + ' first';
            }

            lv.itemDataSource = new WinJS.Binding.List(items).dataSource;
        },

        animateEnterPage: function () {
            var elements = document.querySelectorAll('.titlearea, section[role=main]');
            WinJS.UI.Animation.enterPage(elements);
        },

        unload: function () {
            // TODO: 
        }
    };

    // Public API
    // ----------
    WinJS.UI.Pages.define('/Hilo/hub/hub.html', page);

}());