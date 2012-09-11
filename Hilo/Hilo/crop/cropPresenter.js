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

    function CropPresenterConstructor(imageQuery, canvasEl, cropSelectionEl, appBarEl, imageWriter, expectedFileName, navigation) {
        this.imageQuery = imageQuery;
        this.canvasEl = canvasEl;
        this.cropSelectionEl = cropSelectionEl;
        this.appBarEl = appBarEl;
        this.imageWriter = imageWriter;
        this.expectedFileName = expectedFileName;
        this.navigation = navigation || WinJS.Navigation;

        // We'll bind the methods ahead of time, merely to improve readability
        this.getPictureFromQueryResult = this.getPictureFromQueryResult.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.setupControllers = this.setupControllers.bind(this);
        this.getImageProperties = this.getImageProperties.bind(this);
        this.beginCrop = this.beginCrop.bind(this);
        this.handleAppBarEvents = this.handleAppBarEvents.bind(this);
        this.processPicture = this.processPicture.bind(this);
    }

    // Methods
    // -------

    var cropPresenterMembers = {

        start: function () {
            var self = this;

            return this.imageQuery
                .then(this.getPictureFromQueryResult)
                .then(function (storageFile) {
                    // If the file retrieved by index does not match the name associated
                    // with the query, we assume that it has been deleted (or modified)
                    // and we send the user back to the hub screen.
                    return (!storageFile || storageFile.name != self.expectedFileName)
                        ? self.navigation.navigate("/Hilo/hub/hub.html")
                        : self.processPicture(storageFile);
                });
        },

        processPicture: function (storageFile) {
            return WinJS.Promise.as(storageFile)
                .then(this.getImageUrl)
                .then(this.setupControllers)
                .then(this.getImageProperties)
                .then(this.beginCrop)
                .then(this.handleAppBarEvents);
        },

        getPictureFromQueryResult: function (queryResult) {

            if (queryResult[0]) {
                this.picture = queryResult[0];
                this.storageFile = this.picture.storageFile;
            }            

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
            var imageRect = this.sizeToRect(props);
            this.offset = { x: 0, y: 0 };
            this.imageToScreenScale = this.calculateScaleToScreen(props);
            this.drawImageSelectionToScale(imageRect, this.imageToScreenScale);
        },

        // register event listeners for all of the app bar buttons
        handleAppBarEvents: function () {
            this.appBarPresenter.addEventListener("cancel", this.cancel.bind(this));
            this.appBarPresenter.addEventListener("save", this.saveImageAs.bind(this));
        },

        saveImageAs: function () {

            this.cropImage();

            var cropRect = this.cropSelection.getCoords();
            var selectionRectScaledToImage = this.scaleCanvasRectToImage(this.imageToScreenScale, cropRect, this.offset);

            this.imageWriter
                .crop(this.storageFile, selectionRectScaledToImage)
                .then(function () {
                    WinJS.Navigation.back();
                });
        },

        cancel: function () {
            WinJS.Navigation.back();
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

    // Crop Presenter Definition
    // --------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CropPresenter: WinJS.Class.mix(CropPresenterConstructor, cropPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();