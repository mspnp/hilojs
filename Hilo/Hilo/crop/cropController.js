// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  that code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var screenMaxHeight = 800;
    var screenMaxWidth = 1600;

    // Constructor Function
    // --------------------

    function CropControllerConstructor(fileLoader, canvasEl, rubberBandEl, menuEl) {
        this.fileLoader = fileLoader;
        this.canvasEl = canvasEl;
        this.context = canvasEl.getContext("2d");
        this.rubberBandEl = rubberBandEl;
        this.menuEl = menuEl;
        this.cropOffset = { x: 0, y: 0 };
    }

    // Methods
    // -------

    var cropControllerMembers = {
        start: function () {
            this.fileLoader
                .then(this.getImageUrl.bind(this))
                .then(this.getImageProperties.bind(this))
                .then(this.runImageCropping.bind(this));
        },

        getImageUrl: function (loadedImageArray) {
            var picture = loadedImageArray[0];
            var storageFile = picture.storageFile;

            this.url = URL.createObjectURL(storageFile);

            return storageFile;
        },

        getImageProperties: function (storageFile) {
            return storageFile.properties.getImagePropertiesAsync();
        },

        runImageCropping: function (props) {
            var imageRatio = this.getImageAspectRatio(props);
            var canvasSize = this.getCanvasSize(props, imageRatio);
            var imageScale = this.getImageScale(props, canvasSize);

            this.sizeCanvas(this.canvasEl, canvasSize);

            var rubberBand = new Hilo.Crop.RubberBand(canvasSize);
            var pictureView = new Hilo.Crop.PictureView(this.context, rubberBand, this.url, canvasSize);
            var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, this.canvasEl, this.rubberBandEl);
            var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, this.canvasEl, this.rubberBandEl);

            var menuPresenter = new Hilo.Crop.MenuPresenter(this.menuEl);

            var that = this;
            menuPresenter.addEventListener("crop", function () {

                var coords = rubberBand.getCoords();
                var scaledImageCoordinates = that.scaleCanvasCoordsToImage(imageScale, coords, that.cropOffset);
                var imageRatio = that.getImageAspectRatio(scaledImageCoordinates);
                var canvasSize = that.getCanvasSize(scaledImageCoordinates, imageRatio);

                that.sizeCanvas(that.canvasEl, canvasSize);

                rubberBand.reset(canvasSize);
                rubberBandController.reset();

                pictureView.reset(canvasSize, scaledImageCoordinates);
                rubberBandView.reset();

                //reset image scale and offset to match new canvas and image scaling
                imageScale = that.getImageScale(scaledImageCoordinates, canvasSize);
                that.cropOffset = { x: scaledImageCoordinates.startX, y: scaledImageCoordinates.startY };
            });

        },

        // take the canvas coordinates and scale them to the real image coordinates
        scaleCanvasCoordsToImage: function (imageScale, canvasCoords, cropOffset) {
            var startX = canvasCoords.startX * imageScale.widthScale,
                startY = canvasCoords.startY * imageScale.heightScale,
                endX = canvasCoords.endX * imageScale.widthScale,
                endY = canvasCoords.endY * imageScale.heightScale,
                height = endY - startY,
                width = endX - startX;

            return {
                startX: startX + cropOffset.x,
                startY: startY + cropOffset.y,
                endX: endX + cropOffset.x,
                endY: endY + cropOffset.y,
                height: height,
                width: width
            };
        },

        getImageAspectRatio: function (imageSize) {
            return {
                heightRatio: imageSize.width / imageSize.height,
                widthRatio: imageSize.height / imageSize.width
            }
        },

        getImageScale: function (imageSize, canvasSize) {
            return {
                heightScale: imageSize.height / canvasSize.height,
                widthScale: imageSize.width / canvasSize.width
            };
        },

        getCanvasSize: function (imageSize, aspectRatio) {
            var height, width,
                scale = 1;

            if (imageSize.height > imageSize.width) {

                // height is greater than width, so shrink down to
                // proper height, first
                height = screenMaxHeight;
                width = screenMaxHeight * aspectRatio.heightRatio;

            } else {

                // width is greater than height, so shrink down to
                // the max width first.
                width = screenMaxWidth;
                height = screenMaxWidth * aspectRatio.widthRatio;

            }

            // if the height of the image would go passed the max,
            // then scale it down so that it fits the max
            if (height > screenMaxHeight) {
                scale = screenMaxHeight / height;
            }

            // if the width of the image would go passed the max,
            // then scale it down so that it fits the max
            if (width > screenMaxWidth) {
                scale = screenMaxWidth / width;
            }

            // set final scale
            height = height * scale;
            width = width * scale;

            return {
                height: height,
                width: width
            };
        },

        sizeCanvas: function (canvas, canvasSize) {
            canvas.height = canvasSize.height;
            canvas.width = canvasSize.width;
        }

    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Crop", {
        CropController: WinJS.Class.mix(CropControllerConstructor, cropControllerMembers, WinJS.Utilities.eventMixin)
    });

})();