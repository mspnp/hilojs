﻿(function (global) {

    var Storage = WinJS.Class.define(null, {
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
        this.storage = new Storage();
    }, {
        it: function (description, block) {
            var that = this;
            var storage = this.storage;

            global.it(description, function () {

                waitsFor(function () {
                    return that.done;
                });

                runs(function () {
                    block(storage);
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