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
    var search = Windows.Storage.Search,
        commonFolderQuery = Windows.Storage.Search.CommonFolderQuery,
        viewStates = Windows.UI.ViewManagement.ApplicationViewState;

    // Page Control
    // ------------

    var monthPageControlMembers = {

        ready: function (element, options) {
            var self = this;

            this.queryBuilder = new Hilo.ImageQueryBuilder();

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            var appBarEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(appBarEl, WinJS.Navigation);

            var loadingIndicator = document.querySelector("#loadingProgress");
            var semanticZoom = document.querySelector(".semanticZoomContainer").winControl;

            var zoomInListView = document.querySelector("#monthgroup").winControl;
            var zoomOutListView = document.querySelector("#yeargroup").winControl;

            var presenter = new Hilo.month.MonthPresenter(loadingIndicator, semanticZoom, zoomInListView, zoomOutListView, imageNav);
            presenter.start(Windows.Storage.KnownFolders.picturesLibrary);
        },

        updateLayout: function (element, viewState, lastViewState) {
            if (viewState !== lastViewState) {
            }
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
        },

    };

    Hilo.controls.pages.define("month", monthPageControlMembers);

})();