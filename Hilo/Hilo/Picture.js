(function () {
    "use strict";

    var binding = WinJS.Binding,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode;

    function urlFor(blob) {
        var url = "";
        if (blob) {
            url = "url(" + URL.createObjectURL(blob) + ")";
        }
        return url;
    }

    var base = WinJS.Class.define(function (file) {
        var self = this;

        this.storageFile = file;

        this._initObservable();
        this.addProperty("name", file.name);
        this.addProperty("url", "");
        this.addProperty("src", "");
        this.addProperty("itemDate", "");
        this.addProperty("className", "thumbnail");

        file.getThumbnailAsync(thumbnailMode.picturesView).then(function (thumbnail) {
            self.updateProperty("url", urlFor(thumbnail));
        });

        file.properties.retrievePropertiesAsync(["System.ItemDate"]).then(function (retrieved) {
            self.updateProperty("itemDate", retrieved.lookup("System.ItemDate"));
        });
    },
    {
        loadImage: function () {
            this.updateProperty("src", urlFor(this.storageFile));
        }
    }, {
        from: function (file) {
            return new base(file);
        },
        bindToImageSrc: WinJS.Binding.initializer(function (source, sourceProperties, target, targetProperties) {
            // We're ignoring the properties provided in the binding.
            // We are assuming that we'll always extract the `src` property from the `source`
            // and bind it to the `src` of the `target` (which we expect to be an image tag).

            if (!source.src) {
                source.updateProperty("src", URL.createObjectURL(source.storageFile));
            }

            target.setAttribute('src', source.src);
        }),
    });

    function getValueFrom(source, path) {
        var len = path.length;
        var current = source;
        for (var i = 0; i < len; i++) {
            current = current[path[i]];
            if (current === undefined || current === null) break;
        }

        return current;
    }

    WinJS.Namespace.define("Hilo", {
        Picture: WinJS.Class.mix(base, binding.dynamicObservableMixin)
    });

}());