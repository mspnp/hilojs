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

    // Private Methods
    // ---------------

    function raiseEvent() {
        WinJS.Application.queueEvent({ type: "Hilo:ContentsChanged" });
        return WinJS.Promise.as();
    }

    function listen(folder) {

        var state = {
            pendingChange: false,
            refreshInterval: 15 * 1000,
            lastUpdatedAt: new Date(),
            hasRecentlyUpdated: function () {
                return (new Date() - this.lastUpdatedAt) < this.refreshInterval;
            }
        };

        var disposable = {};
        var builder = new Hilo.ImageQueryBuilder();
        var query = builder.build(folder);
        var handler = contentsChanged.bind(null, state);
        query.fileQuery.addEventListener("contentschanged", handler);

        disposable.query = query;

        return query.fileQuery
            .getFilesAsync(0, 1)
            .then(function () {
                // We don't want to actually return the file we retrieved,
                // so we'll ignore the incoming argument. However, we need
                // `query` to stay in scope so that the events will fire.
                // We've attached it to `disposable` and we'll return it via 
                // the promise.
                return disposable;
            });
    }

    function contentsChanged(state, args) {

        if (state.pendingChange) {
            return;
        }

        state.pendingChange = true;

        var secondsToWait = state.hasRecentlyUpdated() ? state.refreshInterval : 0;

        setTimeout(function () {
            raiseEvent();
            state.pendingChange = false;
            state.lastUpdatedAt = new Date();
        }, (secondsToWait) + 25);
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.contentChangedListener", {
        listen: listen
    });

}());