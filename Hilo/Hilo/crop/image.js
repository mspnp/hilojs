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

    // Image Constructor
    // -----------------

    function ImageConstructor(imageQuery, dataUrl) {
        this.dataUrl = dataUrl;
        this.loadImageFromDataUrl(dataUrl);
        this.loadImageFromQuery(imageQuery);
    }

    // Image Members
    // -------------

    var imageMembers = {

        // Load the data from the `dataUrl` that was provided, and 
        // override the set url and image size, if any, so that
        // we can show the cropped image instead of the original
        loadImageFromDataUrl: function(dataUrl){
            var self = this;

            // create a DOM image to get image data
            var domImage = new Image();
            domImage.onload = function () {
                self.setImageSize(domImage.height, domImage.width);
            };

            this.setUrl(dataUrl);
        },

        // Load image data from the provided `imageQuery` and
        // set the original image size. If no `dataUrl` is provided
        // to this image object, then use the image query to 
        // load and show the image
        loadImageFromQuery: function (imageQuery) {
            var self = this;

            imageQuery.then(function (results) {
                self.picture = results[0];
                self.picture.getProperties().then(function (props) {

                    self.setOriginalSize(props.height, props.width);
                    if (!self.dataUrl) {
                        self.setUrl(self.picture.getUrl("src"));
                        self.setImageSize(props.height, props.width);
                    }

                });
            });
        },

        // Store the size of the original image so the crop process
        // can use it to calculate scale and position of cropping
        setOriginalSize: function (height, width) {
            this.originalImageSize = {
                height: height,
                width: width
            };
        },

        // Store the current image size, based on the cropped area
        // of the image
        setImageSize: function (height, width) {
            this.imageSize = {
                height: height,
                width: width
            };
            this.dispatchEvent("sizeUpdated", {
                imageSize: this.imageSize
            });
        },

        // Set the URL that can be used to draw the image in to
        // the canvas. Using the `url` property, or listening to
        // the `urlUpdated` event ensures the crop process is 
        // showing the correct image, without having to figure out
        // which image to show
        setUrl: function (imageUrl) {
            this.url = imageUrl;
            this.dispatchEvent("urlUpdated", {
                url: imageUrl
            });
        }
    };

    // Public API
    // ----------

    var ImageBase = WinJS.Class.define(ImageConstructor, imageMembers);
    WinJS.Namespace.define("Hilo.Crop", {
        Image: WinJS.Class.mix(ImageBase, WinJS.Utilities.eventMixin)
    });
})();