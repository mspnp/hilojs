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
            var imageToScreenScale = this.calculateScaleToScreen(props);
            var canvasSize = this.calculateCanvasSize(props, imageToScreenScale);

            this.sizeCanvas(this.canvasEl, canvasSize);

            var rubberBand = new Hilo.Crop.RubberBand(canvasSize);
            var pictureView = new Hilo.Crop.PictureView(this.context, rubberBand, this.url, canvasSize);
            var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, this.canvasEl, this.rubberBandEl);
            var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, this.canvasEl, this.rubberBandEl);
            var menuPresenter = new Hilo.Crop.MenuPresenter(this.menuEl);

            var that = this;
            menuPresenter.addEventListener("crop", function () {

                // Get the canvas-based rectangle of the crop selection
                var coords = rubberBand.getCoords();

                // calculate the selected area of the real iamge by scaling
                // the canvas based selection out to the original image
                var selectionRectScaledToImage = that.scaleCanvasRectToImage(imageToScreenScale, coords, that.cropOffset);

                // Calculate the new canvas size based on the rectangle of the crop selection
                // and reset the canvas to that size
                var canvasScale = that.calculateScaleToScreen(selectionRectScaledToImage);
                var canvasSize = that.calculateCanvasSize(selectionRectScaledToImage, canvasScale);
                that.sizeCanvas(that.canvasEl, canvasSize);

                // Reset and re-draw everything according to the new scale
                rubberBand.reset(canvasSize);
                rubberBandController.reset();
                pictureView.reset(canvasSize, selectionRectScaledToImage);
                rubberBandView.reset();

                // reset image scale so that it reflects the difference between
                // the current canvas size, and the original image size
                imageToScreenScale = that.calculateScaleToScreen(selectionRectScaledToImage, canvasSize);

                // remember the starting location of the crop, on the actual image
                // and not relative to the canvas size
                that.cropOffset = { x: selectionRectScaledToImage.startX, y: selectionRectScaledToImage.startY };
            });

        },

        // take the canvas coordinates and scale them to the real image coordinates
        scaleCanvasRectToImage: function (imageToScreenScale, canvasCoords, cropOffset) {
            var startX = canvasCoords.startX / imageToScreenScale,
                startY = canvasCoords.startY / imageToScreenScale,
                endX = canvasCoords.endX / imageToScreenScale,
                endY = canvasCoords.endY / imageToScreenScale,
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

        calculateScaleToScreen: function (size) {
            var heightScale, widthScale;

            heightScale = screenMaxHeight / size.height,
            widthScale = screenMaxWidth / size.width;

            return Math.min(heightScale, widthScale);
        },

        calculateCanvasSize: function (imageSize, scale) {
            var height = imageSize.height * scale;
            var width = imageSize.width * scale;

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