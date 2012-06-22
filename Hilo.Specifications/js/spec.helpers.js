(function () {
    'use strict';

    var utilities = WinJS.Utilities,
        ns = WinJS.Namespace,
        klass = WinJS.Class;

    var scratch_area = '#scratch';

    function async(description, promise, condition) {
        it(description, function () {
            var
                ready = false,
                results;

            runs(function () {
                promise().done(function (r) {
                    ready = true;
                    results = r;
                }, function (err) { throw new Error('test failed: ' + err); })
            });

            waitsFor(function () {
                return ready;
            });

            runs(function () {
                if (condition) condition(results);
            });
        });
    }

    function dom(html) {
        var scratch = document.querySelector(scratch_area);
        utilities.empty(scratch);
        scratch.innerHTML = html;
    }

    var mocking = klass.define(function () {
        //todo: what's a better name for `handle`?
        var self = this;
        self.reset = function () {
            self.mocks = {};
            dom('');

            self.handle = ns.defineWithParent.bind(null, self.mocks);

            self.handle.require = function (service) {
                var retrieved = require.from(self.mocks, service);
                return (retrieved) ? retrieved : require(service);
            }

            self.handle.reset = self.reset;

            self.handle.getMocks = function () {
                return self.mocks;
            };

            self.handle.asClass = function (name, ctr, instanceMembers, staticMembers) {
                var
                    classDefinition = klass.define(ctr, instanceMembers, staticMembers),
                    parts = name.split('.'),
                    namespace = parts.slice(0, -1),
                    className = parts.slice(-1)[0],
                    members = {};

                members[className] = classDefinition;

                ns.defineWithParent(self.mocks, namespace.join('.'), members);
            }

            self.handle.dom = dom;
        };
        self.reset();
    });

    ns.define('Hilo.specs.helpers', {
        async: async,
        mocking: mocking
    });

})();