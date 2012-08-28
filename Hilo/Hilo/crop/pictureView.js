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

    // Picture View Constructor
    // ------------------------

    function PictureViewConstructor(canvasContext, rubberBand, imageUrl, canvasSize) {
        this.context = canvasContext;
        this.canvasSize = canvasSize;

        this.loadAndDisplayImage(imageUrl);

        rubberBand.addEventListener("move", this.drawImage.bind(this));
    }

    // Picture View Members
    // --------------------

    var pictureViewMembers = {

        loadAndDisplayImage: function (imageUrl) {
            this.image = new Image();

            var that = this;
            this.image.onload = function () {

                that.imageSubset = {
                    startX: 0,
                    startY: 0,
                    endX: that.image.width,
                    endY: that.image.height
                };

                that.drawImage();
            };

            this.image.src = imageUrl;
        },

        drawImage: function () {
            if (!this.image) { return; }

            var imageHeight = this.imageSubset.endY - this.imageSubset.startY;
            var imageWidth = this.imageSubset.endX - this.imageSubset.startX;

            this.context.drawImage(
                this.image,

                // cropped area of the image to draw
                this.imageSubset.startX, this.imageSubset.startY, imageWidth, imageHeight,

                // scale the cropped area in to the entire canvas
                0, 0, this.canvasSize.width, this.canvasSize.height
            );
        },

        drawImageSubset: function (imageCoords) {
            this.imageSubset = imageCoords;
            this.drawImage();
        },

        reset: function (canvasSize, scaledImageCoordinates) {
            this.canvasSize = canvasSize;
            this.drawImageSubset(scaledImageCoordinates);
        }
    };

    // Picture View Definition
    // -----------------------

    WinJS.Namespace.define("Hilo.Crop", {
        PictureView: WinJS.Class.define(PictureViewConstructor, pictureViewMembers)
    });

})();