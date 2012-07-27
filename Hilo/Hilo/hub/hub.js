(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var knownFolders = Windows.Storage.KnownFolders;

    // Private Methods
    // ---------------

    var page = {
        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            // Handle the app bar button clicks, and showing / hiding the app bar
            var appBarEl = document.querySelector("#appbar");
            this.appBarController = new Hilo.Hub.AppBarController(appBarEl);

            // Handle selecting and invoking (clicking) images
            var listViewEl = document.querySelector('#picturesLibrary');
            this.listViewController = new Hilo.Hub.ListViewController(listViewEl);

            // Coordinate the parts of the hub view
            var hubViewCoordinator = new Hilo.Hub.HubViewCoordinator(this.appBarController, this.listViewController);
            hubViewCoordinator.start();

            // --------------------
            // There's a disconnect in the style and readability between what is above
            // this note, and what is below it. This is due to the above being a pub-sub/
            // event driven style, and the below being a promise-based style.
            // 
            // These two styles of flow and coordination in JavaScript lend themselves to
            // very different application development styles. The code above is very
            // object oriented, with objects that are decoupled and communicate through
            // events (a pub-sub system). The code below is very functional, facilitated by
            // the use of functions as first class entities with callbacks and promises.
            //
            // The dichotomy between functional and OO style is jarring in a single file
            // like this, but it's not invalid. It illustrates options and ideas that can be
            // used to facilitate different parts of the application.
            // --------------------

            // Get the images we need and animate the screen to show them
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