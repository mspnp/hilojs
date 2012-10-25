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

        loadImageFromDataUrl: function(dataUrl){
            var self = this;

            // create a DOM image to get image data
            var domImage = new Image();
            domImage.onload = function () {
                self.setImageSize(domImage.height, domImage.width);
            };

            this.setUrl(dataUrl);
        },

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

        setOriginalSize: function (height, width) {
            this.originalImageSize = {
                height: height,
                width: width
            };
        },

        setImageSize: function (height, width) {
            this.imageSize = {
                height: height,
                width: width
            };
            this.dispatchEvent("sizeUpdated", {
                imageSize: this.imageSize
            });
        },

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