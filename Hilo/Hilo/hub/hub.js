// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var knownFolders = Windows.Storage.KnownFolders;

    // Private Methods
    // ---------------

    function processLinks() {
        //TODO: replace this temporary solution after we discuss how to define the application flow

        var links = document.querySelectorAll("a");
        Array.prototype.forEach.call(links, function (a) {
            var root = "ms-appx://" + a.host;
            var url = a.href.replace(root, "");
            a.href = "#";
            a.addEventListener("click", function (args) {
                args.preventDefault();
                WinJS.Navigation.navigate(url);
            });
        });
    }

    var page = {
        ready: function (element, options) {

            processLinks();

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

            // Handle the app bar button clicks, and showing / hiding the app bar
            var appBarEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavController(appBarEl, WinJS.Navigation);

            // Handle selecting and invoking (clicking) images
            var listViewEl = document.querySelector("#picturesLibrary");
            this.listViewController = new Hilo.Hub.ListViewController(listViewEl, Windows.UI.ViewManagement.ApplicationView);

            // Coordinate the parts of the hub view
            var hubViewController = new Hilo.Hub.HubViewController(
                WinJS.Navigation,
                imageNav,
                this.listViewController,
                new Hilo.ImageQueryBuilder()
            );

            hubViewController.start(knownFolders.picturesLibrary); 
        },

        updateLayout: function (element, viewState, lastViewState) {
            this.listViewController.setViewState(viewState, lastViewState);
        },

        unload: function () {
        }
    };

    // Public API
    // ----------
    WinJS.UI.Pages.define("/Hilo/hub/hub.html", page);

}());