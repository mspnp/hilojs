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

            var imageQuery = query.execute(selectedIndex);
            this.image = new Hilo.Crop.Image(imageQuery, options.dataUrl, expectedName, options.offset);

            var loadAndDisplay = this.loadAndDisplayCrop.bind(this, options);
            this.image.addEventListener("urlUpdated", loadAndDisplay);

        },

        loadAndDisplayCrop: function (options) {
            var self = this;

            var appBarEl = document.querySelector("#appbar"),
                canvasEl = document.querySelector("#cropSurface"),
                cropSelectionEl = document.querySelector("#cropSelection"),
                imageEl = document.querySelector("#image");

            var cropSelection = new Hilo.Crop.CropSelection(options.cropSelectionCoords);
            var cropSelectionView = new Hilo.Crop.CropSelectionView(cropSelection, canvasEl, cropSelectionEl);
            var cropSelectionController = new Hilo.Crop.CropSelectionController(cropSelection, canvasEl, cropSelectionEl);
            var imageView = new Hilo.Crop.ImageView(this.image, cropSelection, canvasEl, imageEl);

            cropSelection.addEventListener("move", function (args) {
                imageView.drawImage();
                cropSelectionView.cropSelectionMove(args);
            });

            var imageWriter = new Hilo.ImageWriter();
            var cropImageWriter = new Hilo.Crop.CroppedImageWriter(imageWriter);
            var appBarPresenter = new Hilo.Crop.AppBarPresenter(appBarEl);
            this.cropPresenter = new Hilo.Crop.CropPresenter(this.image, imageView, cropImageWriter, appBarPresenter);

            this.cropPresenter.addEventListener("imageSaved", function () {
                WinJS.Navigation.back();
            });

            this.cropPresenter.addEventListener("imagePreview", function (args) {
                var dataUrl = args.detail.dataUrl;

                options.dataUrl = dataUrl;
                options.cropSelectionCoords = cropSelection.getCoords();
                options.offset = self.image.offset;

                self.image.setDataUrl(dataUrl);
            });

            this.cropPresenter.start();
        },

        updateLayout: function (element, viewState, lastViewState) {
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
