// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

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