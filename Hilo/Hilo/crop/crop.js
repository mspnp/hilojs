// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var scaleResolution = 0.7;

    // Page Control
    // ------------

    var page = {

        ready: function (element, options) {

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            var selectedIndex = options.itemIndex;
            var query = options.query;
            var expectedName = options.itemName;

            var fileLoader = query.execute(selectedIndex);

            var menuEl = document.querySelector("#appbar");
            var canvasEl = document.querySelector("#cropSurface");
            var cropSelectionEl = document.querySelector("#cropSelection");

            var imageWriter = new Hilo.ImageWriter();
            var cropImageWriter = new Hilo.Crop.CroppedImageWriter(imageWriter);

            var screenResolution = {
                height: window.innerHeight * scaleResolution,
                width: window.innerWidth * scaleResolution
            };

            this.cropPresenter = new Hilo.Crop.CropPresenter(fileLoader, canvasEl, cropSelectionEl, menuEl, cropImageWriter, expectedName, WinJS.Navigation, screenResolution);
            this.cropPresenter.start();
        },

        updateLayout: function (element, viewState, lastViewState) {
            Hilo.navigator.reload();
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
        }

    };

    Hilo.controls.pages.define("crop", page);
}());
