define('Hilo.Picture', function (require) {

    var klass = WinJS.Class,
        binding = WinJS.Binding;

    function urlFor(blob) {
        return (blob !== null) ? 'url(' + URL.createObjectURL(blob) + ')' : '';
    }

    var base = klass.define(function (file) {
        var self = this;
        this._initObservable();
        this.addProperty('name', file.name);
        this.addProperty('url', urlFor(file.thumbnail));
        this.addProperty('className', 'thumbnail');

        file.addEventListener('thumbnailupdated', function (args) {
            self.updateProperty('url', urlFor(file.thumbnail));
        });
    });

    base.from = function (file) {
        return new base(file);
    }

    return klass.mix(base, binding.dynamicObservableMixin);
});