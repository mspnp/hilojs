(function () {
    'use strict';

    var utilities = WinJS.Utilities,
        ns = WinJS.Namespace,
        klass = WinJS.Class;

    var scratcn_id = 'scratch',
        locateScratch = document.querySelector.bind(document, '#' + scratcn_id);

    // Clean out the scratch area and build new 
    // DOM elements based on the given html.
    function dom(html) {
        var scratch = locateScratch();
        utilities.empty(scratch);
        scratch.innerHTML = html;
    }

    // Finds an existing or appends a new DOM element to the scratch area
    // and then sets the winControl property with the given mock.
    function winControl(name, mock) {
        var target = document.querySelector('#' + name);
        if (!target) {
            target = document.createElement('div');
            target.id = name;
            locateScratch().appendChild(target);
        }
        target.winControl = mock || {};
        return target.winControl;
    }

    // Create a new scratch area.
    function createScratchArea() {
        var area = document.createElement('div');
        area.id = scratcn_id;
        area.style.display = 'none';
        document.body.appendChild(area);
    }

    // The `mocking` object will be exported as the public 
    // interface to the mocks.
    var mocking = klass.define(function () {
        var self = this;

        // If the scratch area does not exist, then we create it.
        if (!locateScratch()) {
            createScratchArea();
        }

        self.reset = function () {
            self.mocks = {};
            dom('');

            //todo: what's a better name for `handle`?
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
            self.handle.winControl = winControl;
        };
        self.reset();
    });

    ns.define('Hilo.specs.helpers', {
        mocking: mocking
    });

})();