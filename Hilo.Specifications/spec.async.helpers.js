(function (global) {

    var constructor = function (spec) {
        this.spec = spec;
    }

    var AsyncSpec = WinJS.Class.define(constructor, {
        it: function (description, block) {
            var that = this;
            var spec = this.spec;

            global.it(description, function () {

                waitsFor(function () {
                    return that.done;
                });

                runs(function () {
                    block(spec);
                });
            });

        },

        beforeEach: function (block) {
            this.done = false;
            var that = this;
            global.beforeEach(function () {
                block(that.complete.bind(that));
            });
        },

        complete: function () {
            this.done = true;
        },

        store: function (fieldName, cb) {
            var that = this;
            return function (data) {
                if (cb) { data = cb(data); }
                that.spec[fieldName] = data;
                return new WinJS.Promise(function (complete) {
                    complete(data);
                });
            }
        }
    });

    global.AsyncSpec = AsyncSpec;
})(this);