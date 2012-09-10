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

    function checkOptions(options, deserialize) {
        if (!options) { return; }

        deserialize = deserialize || Hilo.ImageQueryBuilder.deserialize;

        if (options.query && !options.query.execute) {
            options.query = deserialize(options.query);
        }
    }

    WinJS.Namespace.define("Hilo.controls", {
        checkOptions: checkOptions
    });

}());
