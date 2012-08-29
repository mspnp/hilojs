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

    function CropControllerConstructor(imageQuery, canvasEl, cropSelectionEl, appBarEl) {
        this.imageQuery = imageQuery;
        this.canvasEl = canvasEl;
        this.cropSelectionEl = cropSelectionEl;
        this.appBarEl = appBarEl;
    }

    // Methods
    // -------

    var cropControllerMembers = {
        start: function () {
            this.imageQuery
                .then(this.getPictureFromQueryResult.bind(this))
                .then(this.getImageUrl.bind(this))
                .then(this.setupControllers.bind(this))
                .then(this.getImageProperties.bind(this))
                .then(this.beginCrop.bind(this))
                .then(this.handleAppBarEvents.bind(this));
        },

        getPictureFromQueryResult: function(queryResult){
            this.picture = queryResult[0];
            this.storageFile = this.picture.storageFile;

            // forwarding for the chained "then" calls
            return this.storageFile;
        },

        getImageUrl: function (storageFile) {
            this.url = URL.createObjectURL(storageFile);

            // forwarding for the chained "then" calls
            return storageFile;
        },

        setupControllers: function (storageFile) {
            this.cropSelection = new Hilo.Crop.CropSelection();
            this.pictureView = new Hilo.Crop.PictureView(this.canvasEl, this.cropSelection, this.url);
            this.cropSelectionView = new Hilo.Crop.CropSelectionView(this.cropSelection, this.canvasEl, this.cropSelectionEl);
            this.cropSelectionController = new Hilo.Crop.CropSelectionController(this.cropSelection, this.canvasEl, this.cropSelectionEl);
            this.appBarPresenter = new Hilo.Crop.AppBarPresenter(this.appBarEl);

            // forwarding for the chained "then" calls
            return storageFile;
        },

        // Retrieve all of the "Image Properties" from the storage file, async
        getImageProperties: function (storageFile) {
            return storageFile.properties.getImagePropertiesAsync();
        },

        // Start the image cropping process by drawing the image and
        // crop selection to scale, and then listen for the "crop" button click
        beginCrop: function (props) {
            this.imageProperties = props;
            this.resetCrop();
        },

        // register event listeners for all of the app bar buttons
        handleAppBarEvents: function () {
            this.appBarPresenter.addEventListener("crop", this.cropImage.bind(this));
            this.appBarPresenter.addEventListener("reset", this.resetCrop.bind(this));
        },

        // Reset the image to non-cropped, correctly scaled size
        resetCrop: function () {
            var imageRect = this.sizeToRect(this.imageProperties);

            this.offset = { x: 0, y: 0 };
            this.imageToScreenScale = this.calculateScaleToScreen(this.imageProperties);
            this.drawImageSelectionToScale(imageRect, this.imageToScreenScale);
        },

        // Run the image crop process, visually, to show what the crop result
        // will look like when the file is saved.
        cropImage: function () {
            // Get the canvas-based rectangle of the crop selection
            var coords = this.cropSelection.getCoords();

            // calculate the selected area of the original image by scaling
            // the canvas based selection out to the original image
            var selectionRectScaledToImage = this.scaleCanvasRectToImage(this.imageToScreenScale, coords, this.offset);

            // reset image scale so that it reflects the difference between
            // the current canvas size (the crop selection), and the original 
            // image size, then re-draw everything at that new scale
            this.imageToScreenScale = this.calculateScaleToScreen(selectionRectScaledToImage);
            this.drawImageSelectionToScale(selectionRectScaledToImage, this.imageToScreenScale);

            // remember the starting location of the crop on the original image
            // and not relative to the canvas size, so that cropping multiple times
            // will correctly crop to what has been visually selected
            this.offset = { x: selectionRectScaledToImage.startX, y: selectionRectScaledToImage.startY };
        },

        // Calculate the canvas size, according to the scale, using
        // the crop selection rectangle
        drawImageSelectionToScale: function (cropRect, imageToScreenScale) {
            var canvasSize = this.resizeCanvas(cropRect, imageToScreenScale);

            // reset and re-draw all of the controllers and presenters
            this.cropSelectionController.reset();
            this.pictureView.reset(cropRect);
            this.cropSelection.reset(canvasSize);
            this.cropSelectionView.reset();

            // draw the background image once everything is set up
            this.pictureView.drawImage();
        },

        // convert a size (height/width) in to a rect
        sizeToRect: function (size) {
            return {
                height: size.height,
                width: size.width,
                startX: 0,
                startY: 0,
                endX: size.width,
                endY: size.height
            }
        },

        // take a rectangle that was based on a scaled canvas size
        // and scale the rect up to the real image size, accounting
        // for the offset of the rectangle location
        scaleCanvasRectToImage: function (imageToScreenScale, canvasCoords, offset) {
            var startX = canvasCoords.startX / imageToScreenScale,
                startY = canvasCoords.startY / imageToScreenScale,
                endX = canvasCoords.endX / imageToScreenScale,
                endY = canvasCoords.endY / imageToScreenScale,
                height = endY - startY,
                width = endX - startX;

            return {
                startX: startX + offset.x,
                startY: startY + offset.y,
                endX: endX + offset.x,
                endY: endY + offset.y,
                height: height,
                width: width
            };
        },

        // take a given size (height and width) and
        // calculate the scale that will correctly
        // re-size it to fit the available display
        // area of the screen
        calculateScaleToScreen: function (size) {
            var heightScale, widthScale;

            heightScale = screenMaxHeight / size.height,
            widthScale = screenMaxWidth / size.width;

            return Math.min(heightScale, widthScale, 1);
        },

        // calculate the final size by multiplying 
        // an original size by a specified scale
        calculateSizeFromScale: function (imageSize, scale) {
            var height = imageSize.height * scale;
            var width = imageSize.width * scale;

            return {
                height: height,
                width: width
            };
        },

        // change the size of the specified canvas element to the calculated
        // size, and return the new size
        resizeCanvas: function (imageSelectionSize, imageToScreenScale) {
            var canvasSize = this.calculateSizeFromScale(imageSelectionSize, imageToScreenScale);

            this.canvasEl.height = canvasSize.height;
            this.canvasEl.width = canvasSize.width;

            return canvasSize;
        }
    };

    // Crop Controller Definition
    // --------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CropController: WinJS.Class.mix(CropControllerConstructor, cropControllerMembers, WinJS.Utilities.eventMixin)
    });

})();