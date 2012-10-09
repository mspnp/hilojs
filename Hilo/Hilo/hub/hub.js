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
            var imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(appBarEl, WinJS.Navigation);

            // Handle selecting and invoking (clicking) images
            var listViewEl = document.querySelector("#picturesLibrary");
            this.listViewPresenter = new Hilo.Hub.ListViewPresenter(listViewEl, Windows.UI.ViewManagement.ApplicationView);

            // Coordinate the parts of the hub view
            this.hubViewPresenter = new Hilo.Hub.HubViewPresenter(
                WinJS.Navigation,
                imageNav,
                this.listViewPresenter,
                new Hilo.ImageQueryBuilder()
            );

            WinJS.Application.addEventListener("Hilo:ContentsChanged", this.hubViewPresenter.loadImages);

            this.hubViewPresenter.start(knownFolders.picturesLibrary);
        },

        updateLayout: function (element, viewState, lastViewState) {
            this.listViewPresenter.setViewState(viewState, lastViewState);
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", this.hubViewPresenter.loadImages);
            Hilo.UrlCache.clearAll();
            this.hubViewPresenter.dispose();
            delete this.hubViewPresenter;
        }
    };

    // Public API
    // ----------
    Hilo.controls.pages.define("hub", page);

}());