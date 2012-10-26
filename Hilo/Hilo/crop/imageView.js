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

    // Image View Constructor
    // ------------------------

    function ImageViewConstructor(image, cropSelection, canvasEl) {
        this.cropSelection = cropSelection;
        this.canvasEl = canvasEl;
        this.canvasSize = canvasEl.getBoundingClientRect();
        this.context = canvasEl.getContext("2d");
        this.image = image;

        image.addEventListener("sizeUpdated", this.run.bind(this));
        image.addEventListener("urlUpdated", this.drawImage.bind(this));

        // <SnippetHilojs_1702>
        //cropSelection.addEventListener("move", this.drawImage.bind(this));
        // </SnippetHilojs_1702>
        canvasEl.addEventListener("click", this.click.bind(this));

        this.loadImage(image);
    }

    // Image View Members
    // --------------------

    var imageViewMembers = {
        run: function () {
            this.imageToScreenScale = this.calculateScaleToScreen(this.image.imageSize);
            var imageRect = this.sizeToRect(this.image.imageSize);
            this.drawImageSelectionToScale(imageRect, this.imageToScreenScale);
            this.drawImage();
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
            };
        },

        // take a given size (height and width) and
        // calculate the scale that will correctly
        // re-size it to fit the available display
        // area of the screen
        calculateScaleToScreen: function (size) {
            var heightScale = (window.innerHeight / size.height) * scaleResolution,
                widthScale = (window.innerWidth / size.width) * scaleResolution;

            return Math.min(heightScale, widthScale);
        },

        // Calculate the canvas size, according to the scale, using
        // the crop selection rectangle
        drawImageSelectionToScale: function (cropRect, imageToScreenScale) {
            var canvasSize = this.calculateSizeFromScale(this.image.imageSize, imageToScreenScale);
            this.resizeCanvas(canvasSize);

            // reset and re-draw all of the controllers and presenters
            this.reset(cropRect);
            this.cropSelection.reset(canvasSize);

            // draw the background image once everything is set up
            this.drawImage();
        },

        // calculate the final size by multiplying 
        // an original size by a specified scale
        calculateSizeFromScale: function (originalSize, scale) {
            var height = originalSize.height * scale;
            var width = originalSize.width * scale;

            return {
                height: height,
                width: width
            };
        },

        loadImage: function (imageUrl) {
            this.imgEl = document.getElementById("image");
            this.imgEl.src = imageUrl;
        },

        drawImage: function () {
            if (!this.image) { return; }

            var imageHeight = this.imageSubset.endY - this.imageSubset.startY;
            var imageWidth = this.imageSubset.endX - this.imageSubset.startX;

            this.context.drawImage(
                this.imageToPaint,

                // cropped area of the image to draw
                this.imageSubset.startX, this.imageSubset.startY, imageWidth, imageHeight,

                // scale the cropped area in to the entire canvas
                0, 0, this.canvasSize.width, this.canvasSize.height
            );
        },

        setImageSubset: function (imageCoords) {
            this.imageSubset = imageCoords;
        },

        reset: function (scaledImageCoordinates) {
            this.canvasSize = this.canvasEl.getBoundingClientRect();
            this.setImageSubset(scaledImageCoordinates);

            // build a DOM image object that the canvas can paint
            this.imageToPaint = new Image();
            this.imageToPaint.onload = this.drawImage.bind(this);
            this.imageToPaint.src = this.image.url;
        },

        // <SnippetHilojs_1703>
        click: function () {
            //this.dispatchEvent("preview");
        },
        // </SnippetHilojs_1703>

        // change the size of the specified canvas element to the calculated
        // size, and return the new size
        resizeCanvas: function (canvasSize) {
            this.canvasEl.height = canvasSize.height;
            this.canvasEl.width = canvasSize.width;
        }
    };

    // Image View Definition
    // -----------------------

    WinJS.Namespace.define("Hilo.Crop", {
        ImageView: WinJS.Class.mix(ImageViewConstructor, imageViewMembers, WinJS.Utilities.eventMixin)
    });

})();
