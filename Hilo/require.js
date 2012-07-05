(function (global) {
    'use strict';

    // # Simple Service Location
    // This implementation is inspired by [commonjs](http://www.commonjs.org/).
    // Unlike some implementations, this one does not load scripts.
    // It expects all of the dependencies to already be present in the given context.

    function require(context, definition, throws) {

        var parts = definition.split('.'),
            lastIndex = parts.length - 1,
            found = false,
            current = context;

        parts.forEach(function (part, index) {
            var module;
            if (!(part in current)) {
                if (throws) throw new Error('unable to locate ' + definition);
                return null;
            }
            if (index === lastIndex) {
                module = current[part];

                if (typeof module === 'function' && module.isFactory) {
                    current[part] = module(function (definition) { return require(context, definition, throws); });
                }

                found = true;
            }
            current = current[part];
        });

        return found ? current : undefined;
    }

    // The global version of `require`.
    global.require = function (definition) { return require(global, definition, true); };

    // A context specific version of `require`.
    global.require.from = function (context, definition) { return require(context, definition); };

    //todo: how do we feel about this? 
    // * should it be in its own namespace?
    // * should it be in a separate file?
    global.define = function (name, definition) {

        var parts = name.split('.'),
            namespace = parts.slice(0, -1),
            target = parts.slice(-1)[0],
            members = {};

        if (typeof definition === 'function') {
            definition.isFactory = true;
        }

        members[target] = definition;
        WinJS.Namespace.define(namespace.join('.'), members);
    }

})(window);