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

    var scaleResolution = 0.7;

    // Page Control
    // ------------

    var page = {

        ready: function (element, options) {

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
            Hilo.UrlCache.clearAll();
        }

    };

    Hilo.controls.pages.define("crop", page);
}());
