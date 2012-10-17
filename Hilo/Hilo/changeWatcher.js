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

    // Imports And Constants
    // ---------------------

    // Private Methods
    // ---------------

    function publish() {
        WinJS.Application.queueEvent({ type: "Hilo:ContentsChanged" });
        return WinJS.Promise.as();
    }

    function listen(folder) {
        var builder = new Hilo.ImageQueryBuilder();
        this.querySpecification = builder.build(folder);
        return this.querySpecification
            .execute(0, 1, publish)
            .then(function () {
                // we don't want to actually return the file we retrieve
            });
    }


    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.changeWatcher", {
        listen: listen
    });

}());