// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode;

    // Picture Constructor Function
    // ----------------------------

    function Picture(file) {
        var self = this;

        this.storageFile = file;
        this.urlList = [];

        this._initObservable();
        this.addProperty("name", file.name);
        this.addProperty("url", "");
        this.addProperty("src", "");
        this.addProperty("itemDate", "");
        this.addProperty("className", "thumbnail");

        file.getThumbnailAsync(thumbnailMode.picturesView).then(function (thumbnail) {
            if (self.isDisposed) { return; }
            self.setUrl("url", thumbnail);
        });

        file.properties.retrievePropertiesAsync(["System.ItemDate"]).then(function (retrieved) {
            if (self.isDisposed) { return; }
            self.updateProperty("itemDate", retrieved.lookup("System.ItemDate"));
        });
    }

    // Picture Instance Methods
    // ------------------------

    var pictureMethods = {
        dispose: function () {
            if (this.isDisposed) { return; }
            this.isDisposed = true;

            this.revokeUrls();
            delete this.storageFile;
            delete this.urlList;
        },

        loadImage: function () {
            return this.setUrl("src", this.storageFile);
        },

        setUrl: function (attrName, obj) {
            var url = URL.createObjectURL(obj, { oneTimeOnly: true });
            var config = {
                attrName: attrName,
                url: url,
                backgroundUrl: "url(" + url + ")"
            };

            this.urlList.push(config);
            this.updateProperty(attrName, config.backgroundUrl);

            return config;
        },

        revokeUrls: function () {
            for (var i = 0; i < this.urlList.length; i++) {
                var urlConfig = this.urlList[i];
                URL.revokeObjectURL(urlConfig.url);
            }
            this.urlList = [];
        }
    };

    // Picture Type methods
    // --------------------

    var pictureTypeMethods = {

        // This is a convenience method, typically used in combination with `array.map`:
        //
        // ```js
        // var viewmodels = someArrayOfStorageFiles.map(Hilo.Picture.from);
        // ```

        from: function (file) {
            return new Hilo.Picture(file);
        },

        // This function is to be used in declarative binding in the markup:
        //
        // ```html
        // <div data-win-bind="backgroundImage: src Hilo.Picture.bindToImageSrc"></div>
        // ```
        bindToImageSrc: WinJS.Binding.initializer(function (source, sourceProperties, target, targetProperties) {
            // We're ignoring the properties provided in the binding.
            // We are assuming that we'll always extract the `src` property from the `source`
            // and bind it to the `style.backgroundImage` of the `target` (which we expect to be a div tag).
            // We are not using img tags because a bad file results in a broken image

            if (!source.src) {
                source.loadImage();
            }

            target.style.backgroundImage = 'url(' + source.src + ')';
        }),
    };

    // Public API
    // ----------

    var PictureBase = WinJS.Class.define(Picture, pictureMethods, pictureTypeMethods);

    WinJS.Namespace.define("Hilo", {
        Picture: WinJS.Class.mix(PictureBase, WinJS.Binding.dynamicObservableMixin)
    });

}());