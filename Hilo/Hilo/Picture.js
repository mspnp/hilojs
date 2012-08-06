(function () {
    'use strict';

    var klass = WinJS.Class,
        ns = WinJS.Namespace,
        binding = WinJS.Binding,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode;


    function urlFor(blob) {
        var url = '';
        if (blob) {
            url = 'url(' + URL.createObjectURL(blob) + ')';
        }
        return url;
    }

    var base = klass.define(function (file) {
        var self = this;
        this._initObservable();
        this.addProperty('name', file.name);
        this.addProperty('url', '');
        this.addProperty('dateTaken', '');
        this.addProperty('itemDate', '');

        file.getBasicPropertiesAsync().then(function (properties) {
            self.updateProperty('itemDate', properties.itemDate);
        });

        file.properties.getImagePropertiesAsync().then(function (properties) {
            self.updateProperty('dateTaken', properties.dateTaken);
        });

        file.getThumbnailAsync(thumbnailMode.picturesView).then(function (thumbnail) {
            self.updateProperty('url', urlFor(thumbnail));
        });

        this.addProperty('className', 'thumbnail');
        this.addProperty('src', URL.createObjectURL(file));
    });

    base.from = function (file) {
        return new base(file);
    }

    ns.define('Hilo', {
        Picture: klass.mix(base, binding.dynamicObservableMixin)
    });

}());
