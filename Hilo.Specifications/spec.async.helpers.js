(function (global) {

    var Spec = WinJS.Class.define(null, {
        store: function (fieldName, cb) {
            var that = this;
            return function (data) {
                if (cb) { data = cb(data); }
                that[fieldName] = data;
                return new WinJS.Promise(function (complete) {
                    complete(data);
                });
            }
        }
    });

    var AsyncSpec = WinJS.Class.define(function () {
        this.spec = new Spec();
    }, {
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
        }
    });

    global.AsyncSpec = AsyncSpec;
})(this);