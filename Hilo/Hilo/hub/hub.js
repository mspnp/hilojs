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

    // <SnippetHilojs_1403>
    Hilo.controls.pages.define("hub", {

        // <SnippetHilojs_1408>
        // <SnippetHilojs_1618>
        ready: function (element, options) {

            // Handle the app bar button clicks for showing and hiding the app bar.
            var appBarEl = document.querySelector("#appbar");
            var hiloAppBar = new Hilo.Controls.HiloAppBar.HiloAppBarPresenter(appBarEl, WinJS.Navigation);

            // Handle selecting and invoking (clicking) images.
            var listViewEl = document.querySelector("#picturesLibrary");
            this.listViewPresenter = new Hilo.Hub.ListViewPresenter(listViewEl, Windows.UI.ViewManagement.ApplicationView);

            // Coordinate the parts of the hub page.
            this.hubViewPresenter = new Hilo.Hub.HubViewPresenter(
                WinJS.Navigation,
                hiloAppBar,
                this.listViewPresenter,
                new Hilo.ImageQueryBuilder()
            );

            this.hubViewPresenter
                .start(knownFolders.picturesLibrary)
                .then(function () {
                    WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
                });
        },
        // </SnippetHilojs_1618>
        // </SnippetHilojs_1408>

        // <SnippetHilojs_1411>
        updateLayout: function (element, viewState, lastViewState) {
            this.listViewPresenter.setViewState(viewState, lastViewState);
        },
        // </SnippetHilojs_1411>

        unload: function () {
            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
            this.hubViewPresenter.dispose();
            this.hubViewPresenter = null;
        }
    });
    // </SnippetHilojs_1403>

}());
