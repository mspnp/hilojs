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

    // Page Control
    // ---------------
    var page = {

        ready: function (element, options) {

            // Handle the app bar button clicks, and showing / hiding the app bar
            var appBarEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavController(appBarEl, WinJS.Navigation);

            // Handle selecting and invoking (clicking) images
            var listViewEl = document.querySelector("#picturesLibrary");
            this.listViewController = new Hilo.Hub.ListViewController(listViewEl, Windows.UI.ViewManagement.ApplicationView);

            // Coordinate the parts of the hub view
            this.hubViewController = new Hilo.Hub.HubViewController(
                WinJS.Navigation,
                imageNav,
                this.listViewController,
                new Hilo.ImageQueryBuilder()
            );

            this.hubViewController.start(knownFolders.picturesLibrary);
        },

        updateLayout: function (element, viewState, lastViewState) {
            this.listViewController.setViewState(viewState, lastViewState);
        },

        unload: function () {
            this.hubViewController.dispose();
        }
    };

    // Public API
    // ----------
    Hilo.controls.pages.define("hub", page);

}());