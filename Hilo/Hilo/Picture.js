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
        this.addProperty('itemDate', '');

        file.getThumbnailAsync(thumbnailMode.picturesView).then(function (thumbnail) {
            self.updateProperty('url', urlFor(thumbnail));
        });

        file.properties.retrievePropertiesAsync(['System.ItemDate']).then(function (retrieved) {
            self.updateProperty('itemDate', retrieved.lookup('System.ItemDate'));
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
