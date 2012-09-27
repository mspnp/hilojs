// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // <SnippetHilojs_1805>
    function checkOptions(options, deserialize) {
        if (!options) { return; }

        deserialize = deserialize || Hilo.ImageQueryBuilder.deserialize;

        if (options.query && !options.query.execute) {
            var original = options.query;
            var query = deserialize(original);

            // Copy any properties that were not produced 
            // from the deserialization.
            Object.keys(original).forEach(function (property) {
                if (!query[property]) {
                    query[property] = original[property];
                }
            });

            options.query = query;
        }
    }
    // </SnippetHilojs_1805>

    WinJS.Namespace.define("Hilo.controls", {
        checkOptions: checkOptions
    });

}());
