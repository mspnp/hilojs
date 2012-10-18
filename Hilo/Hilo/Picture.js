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

    // Imports And Constants
    // ---------------------

    var thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode;

    // Picture Constructor Function
    // ----------------------------

    function Picture(file) {
        var self = this;

        this.addUrl = this.addUrl.bind(this);

        this.storageFile = file;
        this.urlList = {};
        this.isDisposed = false;

        this._initObservable();
        this.addProperty("name", file.name);
        this.addProperty("url", "");
        this.addProperty("src", "");
        this.addProperty("itemDate", "");
        this.addProperty("className", "thumbnail");

        this.loadFileProperties();
        this.loadUrls();
    }

    // Picture Instance Methods
    // ------------------------

    var pictureMethods = {
        dispose: function () {
            if (this.isDisposed) { return; }
            this.isDisposed = true;

            Hilo.UrlCache.clear(this.storageFile.name);
            this.storageFile = null;
            this.urlList = null;
        },

        loadFileProperties: function () {
            var file = this.storageFile,
                self = this;

            if (file && file.properties) {
                file.properties.retrievePropertiesAsync(["System.ItemDate"]).then(function (retrieved) {
                    if (self.isDisposed) { return; }
                    self.updateProperty("itemDate", retrieved.lookup("System.ItemDate"));
                });
            }
        },

        loadUrls: function () {
            var file = this.storageFile;

            if (file && file.getThumbnailAsync) {
                Hilo.UrlCache.getUrl(file.path, "url", function () {
                    return file.getThumbnailAsync(thumbnailMode.picturesView);
                }).then(this.addUrl);
            }

            Hilo.UrlCache
                .getUrl(file.name, "src", file)
                .then(this.addUrl);
        },

        addUrl: function (urlConfig) {
            this.urlList[urlConfig.attrName] = urlConfig;
            this.updateProperty(urlConfig.attrName, urlConfig);
            this.dispatchEvent("url:set", urlConfig);
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
            target.style.backgroundImage = source.src.backgroundUrl;
        }),
    };

    // Public API
    // ----------

    var PictureBase = WinJS.Class.define(Picture, pictureMethods, pictureTypeMethods);

    WinJS.Namespace.define("Hilo", {
        Picture: WinJS.Class.mix(PictureBase, WinJS.Binding.dynamicObservableMixin, WinJS.Utilities.eventMixin)
    });

}());
