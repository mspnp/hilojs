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

                var coords = rubberBand.getCoords();
                var selectionRectScaledToImage = that.scaleCanvasCoordsToImage(imageToScreenScale, coords, that.cropOffset);
                var canvasScale = that.calculateScaleToScreen(selectionRectScaledToImage);
                var canvasSize = that.calculateCanvasSize(selectionRectScaledToImage, canvasScale);

                that.sizeCanvas(that.canvasEl, canvasSize);

                rubberBand.reset(canvasSize);
                rubberBandController.reset();

                pictureView.reset(canvasSize, selectionRectScaledToImage);
                rubberBandView.reset();

                //reset image scale and offset to match new canvas and image scaling
                imageToScreenScale = that.calculateScaleToScreen(selectionRectScaledToImage, canvasSize);
                that.cropOffset = { x: selectionRectScaledToImage.startX, y: selectionRectScaledToImage.startY };
            });

        },

        // take the canvas coordinates and scale them to the real image coordinates
        scaleCanvasCoordsToImage: function (imageToScreenScale, canvasCoords, cropOffset) {
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