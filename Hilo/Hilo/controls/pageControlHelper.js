// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

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
