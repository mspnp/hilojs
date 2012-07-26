(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState,
        appView = Windows.UI.ViewManagement.ApplicationView,
        knownFolders = Windows.Storage.KnownFolders,
        nav = WinJS.Navigation;


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

    var mediator = {
        run: function (appbar, listview) {
            this.listview = listview;
            this.appbar = appbar;
            var app = WinJS.Application;

            app.addEventListener("appbar:rotate", this.rotateClicked.bind(this));
            app.addEventListener("appbar:crop", this.cropClicked.bind(this));
            app.addEventListener("listview:selectionChanged", this.selectionChanged.bind(this));
            app.addEventListener("listview:itemInvoked", this.itemClicked.bind(this));

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
    };

    var page = {
        ready: function (element, options) {

            WinJS.Resources.processAll();

            var listViewEl = document.querySelector('#picturesLibrary');
            this.listViewController = new Hilo.Hub.ListViewController(listViewEl);

            appbarBuilder.setup();

            mediator.run(appbarBuilder, this.listViewController);

            new Hilo.ImageRepository(knownFolders.picturesLibrary)
                .getBindableImages(6)
                .then(this.bindImages.bind(this))
                .then(this.animateEnterPage);
        },

        updateLayout: function (element, viewState, lastViewState) {
            this.listViewController.setViewState(viewState);
        },

        bindImages: function (items) {

            if (items.length > 0) {
                items[0].className = items[0].className + ' first';
            }

            this.listViewController.setDataSource(items);
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