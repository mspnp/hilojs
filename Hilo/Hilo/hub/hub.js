﻿// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

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
            var hiloAppBar = new Hilo.Controls.HiloAppBar.HiloAppBarPresenter(appBarEl, WinJS.Navigation);

            // Handle selecting and invoking (clicking) images
            var listViewEl = document.querySelector("#picturesLibrary");
            this.listViewPresenter = new Hilo.Hub.ListViewPresenter(listViewEl, Windows.UI.ViewManagement.ApplicationView);

            // Coordinate the parts of the hub view
            this.hubViewPresenter = new Hilo.Hub.HubViewPresenter(
                WinJS.Navigation,
                hiloAppBar,
                this.listViewPresenter,
                new Hilo.ImageQueryBuilder()
            );

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            this.hubViewPresenter.start(knownFolders.picturesLibrary);
        },

        updateLayout: function (element, viewState, lastViewState) {
            this.listViewPresenter.setViewState(viewState, lastViewState);
        },

        unload: function () {
            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
            this.hubViewPresenter.dispose();
            this.hubViewPresenter = null;
        }
    };

    // Public API
    // ----------
    // <SnippetHilojs_1403>
    Hilo.controls.pages.define("hub", page);
    // </SnippetHilojs_1403>

}());
