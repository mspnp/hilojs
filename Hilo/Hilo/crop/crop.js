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

            var storageFile, url, imageProps, imageRatio, imageScale, canvasSize;
            var that = this;

            fileLoader.then(function (loadedImageArray) {

                var picture = loadedImageArray[0];

                storageFile = picture.storageFile;
                url = URL.createObjectURL(storageFile);

                return storageFile.properties.getImagePropertiesAsync();

            }).then(function (props) {
                imageProps = props;

                imageRatio = that.getImageAspectRatio(props);
                canvasSize = that.getCanvasSize(props, imageRatio);
                imageScale = that.getCanvasScale(props, canvasSize);

                that.sizeCanvas(canvasEl, canvasSize);

                var rubberBand = new Hilo.Crop.RubberBand(canvasSize);
                var pictureView = new Hilo.Crop.PictureView(context, rubberBand, url, canvasSize);
                var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, canvasEl, rubberBandEl);
                var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, canvasEl, rubberBandEl);

                var menuPresenter = new Hilo.Crop.MenuPresenter(menuEl);
                menuPresenter.addEventListener("crop", function () {

                    var coords = rubberBand.getCoords();
                    var scaledImageCoordinates = that.scaleCanvasCoordsToImage(imageScale, coords);
                    var newRatio = that.getImageAspectRatio(scaledImageCoordinates);
                    var canvasSize = that.getCanvasSize(scaledImageCoordinates, newRatio);

                    that.sizeCanvas(canvasEl, canvasSize);

                    rubberBand.reset(canvasSize);
                    rubberBandController.reset();

                    pictureView.reset(canvasSize, scaledImageCoordinates);
                    rubberBandView.reset();
                });

            });
        },

        // take the canvas coordinates and scale them to the real image coordinates
        scaleCanvasCoordsToImage: function (imageScale, canvasCoords) {
            var startX = canvasCoords.startX * imageScale.widthScale,
                startY = canvasCoords.startY * imageScale.heightScale,
                endX = canvasCoords.endX * imageScale.widthScale,
                endY = canvasCoords.endY * imageScale.heightScale,
                height = endY - startY,
                width = endX - startX;

            return {
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                height: height,
                width: width
            };
        },

        getImageAspectRatio: function (imageSize) {
            return {
                widthRatio: imageSize.width / imageSize.height,
                heightRatio: imageSize.height / imageSize.width
            }
        },

        getCanvasScale: function (imageSize, canvasSize) {
            return {
                heightScale: imageSize.height / canvasSize.height,
                widthScale: imageSize.width / canvasSize.width
            };
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
                    height: screenMaxWidth * aspectRatio.heightRatio,
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
