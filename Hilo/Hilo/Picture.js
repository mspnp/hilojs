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
        this.addProperty("isCorrupt", false);
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
                file.properties.getImagePropertiesAsync().done(function (props) {
                    if (props.height === 0 && props.width === 0) {
                        self.setCorruptImage();
                    }
                });
            }
        },

        setCorruptImage: function(){
            this.updateProperty("isCorrupt", true);
            var urlConfig = {
                attrName: "url",
                url: "/Assets/HiloStoreLogo.scale-180.png",
                backgroundUrl: 'url("/Assets/HiloStoreLogo.scale-180.png")',
            };

            this.addUrl(urlConfig);
            urlConfig.attrName = "src";
            this.addUrl(urlConfig);
        },

        loadUrls: function () {
            var file = this.storageFile;
            var self = this;

            if (file && file.getThumbnailAsync) {
                Hilo.UrlCache.getUrl(file.path, "url", function () {
                    return file.getThumbnailAsync(thumbnailMode.picturesView);
                }).then(function (urlConfig) {
                    if (!self.isCorrupt) {
                        self.addUrl(urlConfig);
                    }
                });
            }

            Hilo.UrlCache
                .getUrl(file.name, "src", file)
                .then(function (urlConfig) {
                    if (!self.isCorrupt) {
                        self.addUrl(urlConfig);
                    }
                });
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
