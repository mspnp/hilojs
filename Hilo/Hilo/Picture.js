(function () {
    'use strict';

    var klass = WinJS.Class,
        ns = WinJS.Namespace,
        binding = WinJS.Binding;

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
        this.addProperty('dateTaken', file.imageProperties.dateTaken);
        this.addProperty('url', urlFor(file.thumbnail));
        this.addProperty('className', 'thumbnail');
        this.addProperty('src', URL.createObjectURL(file));

        file.addEventListener('thumbnailupdated', function (args) {
            self.updateProperty('url', urlFor(file.thumbnail));
        });
    });

    base.from = function (file) {
        return new base(file);
    }

    ns.define('Hilo', {
        Picture: klass.mix(base, binding.dynamicObservableMixin)
    });

}());