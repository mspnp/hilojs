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

    // Private Methods
    // ---------------

    var appbarBuilder = {
        setup: function () {
            this.appbar = document.querySelector('#appbar').winControl;
            var buttons = document.querySelectorAll('#appbar button');
            var that = this;

            Array.prototype.forEach.call(buttons, function (x) {
                x.addEventListener('click', function (args) {
                    WinJS.Application.queueEvent("appbar:" + args.currentTarget.id);
                });
            });
        },

        show: function () {
            this.appbar.show();
        },

        hide: function () {
            this.appbar.hide();
        }
    };

    var listViewBuilder = {

        setup: function () {
            this.lv = document.querySelector('#picturesLibrary').winControl;

            this.lv.layout = this.selectLayout(appView.value);

            this.lv.addEventListener('iteminvoked', this.imageNavigated.bind(this));
            this.lv.addEventListener('selectionchanged', this.imageSelected.bind(this));
        },

        setDataSource: function (items) {
            this.lv.itemDataSource = new WinJS.Binding.List(items).dataSource;
        },

        setViewState: function (viewState) {
            this.lv.layout = listViewBuilder.selectLayout(viewState);
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
            return this.lv.selection.getIndices();
        },

        imageSelected: function (args) {
            var itemIndex = this.getIndices();
            var hasItemSelected = itemIndex.length > 0;
            WinJS.Application.queueEvent({ type: "listview:selectionChanged", hasItemSelected: hasItemSelected });
        },

        imageNavigated: function (args) {
            WinJS.Application.queueEvent({ type: "listview:itemInvoked", itemIndex: args.detail.itemIndex });
        }
    };

    var mediator = WinJS.Class.define(function (appbar, listview) {
        this.listview = listview;
        this.appbar = appbar;
        var app = WinJS.Application;

        app.addEventListener("appbar:rotate", this.rotateClicked.bind(this));
        app.addEventListener("appbar:crop", this.cropClicked.bind(this));
        app.addEventListener("listview:selectionChanged", this.selectionChanged.bind(this));
        app.addEventListener("listview:itemInvoked", this.itemClicked.bind(this));

    }, {

        rotateClicked: function () {
            var indices = this.listview.getIndices();
            WinJS.Navigation.navigate('/Hilo/rotate/rotate.html', indices[0]);
        },

        cropClicked: function () {
            var indices = this.listview.getIndices();
            WinJS.Navigation.navigate('/Hilo/crop/crop.html', indices[0]);
        },

        selectionChanged: function (args) {
            var buttons = document.querySelectorAll('#appbar button');
            Array.prototype.forEach.call(buttons, function (x) {
                x.winControl.disabled = !args.hasItemSelected;
            });

            if (args.hasItemSelected) {
                this.appbar.show();
            } else {
                this.appbar.hide();
            }
        },

        itemClicked: function (args) {
            nav.navigate('/Hilo/detail/detail.html', args.itemIndex);
        }
    });

    var page = {
        ready: function (element, options) {

            WinJS.Resources.processAll();

            listViewBuilder.setup();
            appbarBuilder.setup();

            new mediator(appbarBuilder, listViewBuilder);

            new Hilo.ImageRepository(knownFolders.picturesLibrary)
                .getBindableImages(6)
                .then(this.bindImages)
                .then(this.animateEnterPage);
        },

        updateLayout: function (element, viewState, lastViewState) {
            listViewBuilder.setViewState(viewState);
        },

        bindImages: function (items) {

            if (items.length > 0) {
                items[0].className = items[0].className + ' first';
            }

            listViewBuilder.setDataSource(items);
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