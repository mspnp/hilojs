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

    var screenMaxHeight, screenMaxWidth;

    // Constructor Function
    // --------------------

    function CropPresenterConstructor(imageQuery, canvasEl, appBarEl, imageWriter, expectedFileName, navigation, screenRes) {
        screenMaxHeight = screenRes.height;
        screenMaxWidth = screenRes.width;

        this.imageQuery = imageQuery;
        this.canvasEl = canvasEl;
        this.appBarEl = appBarEl;
        this.imageWriter = imageWriter;
        this.expectedFileName = expectedFileName;
        this.navigation = navigation || WinJS.Navigation;

        this.imageWriter.addEventListener("errorOpeningSourceFile", function (error) {
            WinJS.Navigation.navigate("/Hilo/hub/hub.html");
        });

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
                    if (!storageFile || storageFile.name !== self.expectedFileName) {
                        return self.navigation.navigate("/Hilo/hub/hub.html");
                    } else {
                        return self.processPicture(storageFile);
                    }
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
            this.appBarPresenter = new Hilo.Crop.AppBarPresenter(this.appBarEl);

            // <SnippetHilojs_1704>
            this.imageView.addEventListener("preview", this.cropImage.bind(this));
            // </SnippetHilojs_1704>

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
            this.offset = { x: 0, y: 0 };
        },

        // register event listeners for all of the app bar buttons
        handleAppBarEvents: function () {
            this.appBarPresenter.addEventListener("cancel", this.cancel.bind(this));
            this.appBarPresenter.addEventListener("save", this.saveImageAs.bind(this));
            this.appBarPresenter.addEventListener("unsnap", this.unSnapView.bind(this));
        },

        unSnapView: function () {
            Windows.UI.ViewManagement.ApplicationView.tryUnsnap();
        },

        saveImageAs: function () {
            var self = this;
            var cropRect = this.cropSelection.getCoords();
            var selectionRectScaledToImage = this.scaleCanvasRectToImage(this.imageToScreenScale, cropRect, this.offset);

            this.imageWriter
                .crop(this.storageFile, selectionRectScaledToImage)
                .then(function (success) {
                    if (success) {
                        self.navigation.back();
                    }
                });
        },

        cancel: function () {
            WinJS.Navigation.back();
        },

        // Run the image crop process, visually, to show what the crop result
        // will look like when the file is saved.
        // <SnippetHilojs_1609>
        // <SnippetHilojs_1705>
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
        // </SnippetHilojs_1705>
        // </SnippetHilojs_1609>

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
        }

    };

    // Crop Presenter Definition
    // --------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CropPresenter: WinJS.Class.mix(CropPresenterConstructor, cropPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();
