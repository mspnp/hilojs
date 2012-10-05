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
        this.urlList = {};

        this._initObservable();
        this.addProperty("name", file.name);
        this.addProperty("url", "");
        this.addProperty("src", "");
        this.addProperty("itemDate", "");
        this.addProperty("className", "thumbnail");

        file.getThumbnailAsync(thumbnailMode.picturesView).then(function (thumbnail) {
            if (self.isDisposed) { return; }
            Hilo.Picture.setUrl(self, "url", thumbnail);
        });

        file.properties.retrievePropertiesAsync(["System.ItemDate"]).then(function (retrieved) {
            if (self.isDisposed) { return; }
            self.updateProperty("itemDate", retrieved.lookup("System.ItemDate"));
        });

        this.loadImage();
    }

    // Picture Instance Methods
    // ------------------------

    var pictureMethods = {
        dispose: function () {
            if (this.isDisposed) { return; }
            this.isDisposed = true;

            delete this.storageFile;
            delete this.urlList;
        },

        loadImage: function () {
            return Hilo.Picture.setUrl(this, "src", this.storageFile);
        },

        addUrl: function (attrName, urlConfig) {
            this.urlList[attrName] = urlConfig;
        },

        getUrl: function (name) {
            var config = this.urlList[name];
            var url;

            if (config) {
                url = config.url;
            }

            return url;
        }
    };

    // Picture Type methods
    // --------------------

    var pictureTypeMethods = {
        urlList: [],

        revokeUrls: function () {
            for (var attr in this.urlList) {
                if (this.urlList.hasOwnProperty(attr)) {
                    var urlConfig = this.urlList[attr];
                    URL.revokeObjectURL(urlConfig.url);
                }
            }
            this.urlList = [];
        },

        setUrl: function (picture, attrName, obj) {
            var url = URL.createObjectURL(obj);
            var config = {
                attrName: attrName,
                url: url,
                backgroundUrl: "url(" + url + ")"
            };

            this.urlList.push(config);
            picture.addUrl(attrName, config);
            picture.updateProperty(attrName, config.backgroundUrl);

            picture.dispatchEvent("url:set", config);

            return config;
        },

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

            if (!source.src || source.src) {
                source.loadImage();
            }

            target.style.backgroundImage = 'url(' + source.src + ')';
        }),
    };

    // Public API
    // ----------

    var PictureBase = WinJS.Class.define(Picture, pictureMethods, pictureTypeMethods);

    WinJS.Namespace.define("Hilo", {
        Picture: WinJS.Class.mix(PictureBase, WinJS.Binding.dynamicObservableMixin, WinJS.Utilities.eventMixin)
    });

}());