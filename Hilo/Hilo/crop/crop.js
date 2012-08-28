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

    var screenMaxHeight = 800;
    var screenMaxWidth = 1600;

    // Page Control
    // ------------

    var page = {

        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

            var selectedIndex = options.itemIndex;
            var query = options.query;
            var fileLoader = query.execute(selectedIndex);

            var canvasEl = document.querySelector("#cropSurface");
            var context = canvasEl.getContext("2d");
            var rubberBandEl = document.querySelector("#rubberBand");
            var menuEl = document.querySelector("#appbar");

            var storageFile, url, imageProps, imageRatio;
            var that = this;

            fileLoader.then(function (loadedImageArray) {

                var picture = loadedImageArray[0];

                storageFile = picture.storageFile;
                url = URL.createObjectURL(storageFile);

                return storageFile.properties.getImagePropertiesAsync();

            }).then(function (props) {
                imageProps = props;

                imageRatio = that.getImageAspectRatio(props);
                var canvasSize = that.getCanvasSize(props, imageRatio);

                that.sizeCanvas(canvasEl, canvasSize);

                var rubberBand = new Hilo.Crop.RubberBand(canvasSize);
                var pictureView = new Hilo.Crop.PictureView(context, rubberBand, url, canvasSize);
                var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, canvasEl, rubberBandEl);
                var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, canvasEl, rubberBandEl);

                var menuPresenter = new Hilo.Crop.MenuPresenter(menuEl);
                menuPresenter.addEventListener("crop", function () {

                });

            });
        },

        getImageAspectRatio: function (imageSize) {
            return {
                widthRatio: imageSize.width / imageSize.height,
                heightRatio: imageSize.height / imageSize.width
            }
        },

        getCanvasSize: function (imageSize, aspectRatio) {
            var scaledSize;

            if (imageSize.height > imageSize.width) {
                scaledSize = {
                    height: screenMaxHeight,
                    width: screenMaxHeight * aspectRatio.widthRatio
                };
            } else {
                scaledSize = {
                    height: screeMaxWidth * aspectRatio.heightRatio,
                    width: screenMaxWidth
                };
            }

            return scaledSize;
        },

        sizeCanvas: function (canvas, canvasSize) {
            canvas.height = canvasSize.height;
            canvas.width = canvasSize.width;
        },

    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
