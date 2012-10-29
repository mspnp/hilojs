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

    function ImageConstructor(imageQuery, dataUrl, expectedFileName, offset) {
        this.offset = offset || { x: 0, y: 0 };
        this.expectedFileName = expectedFileName;
        this.dataUrl = dataUrl;

        this.loadImageFromQuery(imageQuery);
    }

    // Image Members
    // -------------

    var imageMembers = {

        // Load image data from the provided `imageQuery` and
        // set the original image size. 
        loadImageFromQuery: function (imageQuery) {
            var self = this;

            imageQuery.then(function (results) {
                self.picture = results[0];
                self.picture.getProperties().then(function (props) {

                    self.validateFileName();
                    var url = self.picture.getUrl("src");
                    self.setUrl(url);
                    self.setDataUrl(url);
                    self.setImageSize(props.height, props.width);

                });
            });
        },

        validateFileName: function(){

            // If the file retrieved by index does not match the name associated
            // with the query, we assume that it has been deleted (or modified)
            // and we send the user back to the hub screen.
            if (!this.picture || this.picture.name !== this.expectedFileName) {
                return WinJS.Navigation.navigate("/Hilo/hub/hub.html");
            }
        },

        getStorageFile: function () {
            return this.picture.storageFile;
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
        },

        setDataUrl: function (dataUrl) {
            this.dataUrl = dataUrl;
            this.dispatchEvent("dataUrlUpdated", {
                url: dataUrl
            });
        },

        updateOffset: function (offset) {
            this.offset.x = offset.x;
            this.offset.y = offset.y;
        },
    };

    // Public API
    // ----------

    var ImageBase = WinJS.Class.define(ImageConstructor, imageMembers);
    WinJS.Namespace.define("Hilo.Crop", {
        Image: WinJS.Class.mix(ImageBase, WinJS.Utilities.eventMixin)
    });
})();