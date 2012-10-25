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

            var selectedIndex = options.itemIndex,
                query = options.query,
                expectedName = options.itemName;

            var menuEl = document.querySelector("#appbar"),
                canvasEl = document.querySelector("#cropSurface"),
                cropSelectionEl = document.querySelector("#cropSelection");

            var screenResolution = {
                height: window.innerHeight * scaleResolution,
                width: window.innerWidth * scaleResolution
            };

            var cropSelection = new Hilo.Crop.CropSelection();
            var cropSelectionView = new Hilo.Crop.CropSelectionView(cropSelection, canvasEl, cropSelectionEl);
            var cropSelectionController = new Hilo.Crop.CropSelectionController(cropSelection, canvasEl, cropSelectionEl);

            var imageQuery = query.execute(selectedIndex);
            var image = new Hilo.Crop.Image(imageQuery, options.dataUrl);
            var imageView = new Hilo.Crop.ImageView(image, cropSelection, canvasEl);

            cropSelection.addEventListener("move", function (args) {
                imageView.drawImage(args);
                cropSelectionView.cropSelectionMove(args);
            });

            image.addEventListener("sizeUpdated", function (args) {
                imageView.run();
            });

            //var imageWriter = new Hilo.ImageWriter();
            //var cropImageWriter = new Hilo.Crop.CroppedImageWriter(imageWriter, options.dataUrl);

            //this.cropPresenter = new Hilo.Crop.CropPresenter(imageQuery, canvasEl, menuEl, cropImageWriter, expectedName, WinJS.Navigation, screenResolution);
            //this.cropPresenter.start();
        },

        updateLayout: function (element, viewState, lastViewState) {
            Hilo.navigator.reload();
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
        },

        getAnimationElements: function () {
            return [];
        }

    };

    Hilo.controls.pages.define("crop", page);
}());
