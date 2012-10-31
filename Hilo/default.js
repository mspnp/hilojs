// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // # Bootstrapper
    // This script is responsible for bootstrapping the application.

    var activation = Windows.ApplicationModel.Activation,
        app = WinJS.Application,
        nav = WinJS.Navigation;

    // According to the official documentation, 
    // http://msdn.microsoft.com/en-us/library/windows/apps/jj215606.aspx
    // the following should always be set to true.
    // <SnippetHilojs_1601>
    WinJS.Binding.optimizeBindingReferences = true;
    // </SnippetHilojs_1601>

    // <SnippetHilojs_1803>
    app.addEventListener("activated", function (args) {

        var currentState = args.detail;

        if (currentState.kind === activation.ActivationKind.launch) {

            if (currentState.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

                // When the app is launched, we want to update its tile
                // on the start screen
                if (!Windows.ApplicationModel.DesignMode.designModeEnabled) {
                    // <SnippetHilojs_1010>
                    var tileUpdater = new Hilo.Tiles.TileUpdater();
                    tileUpdater.update();
                    // </SnippetHilojs_1010>
                }

                // Begin listening for changes in the `picturesLibrary`,
                // if files are added, deleted, or modified, then we'll
                // want to update the current screen accordingly.
                Hilo.contentChangedListener
                    .listen(Windows.Storage.KnownFolders.picturesLibrary);

            } else {
                // This application has been reactivated from suspension.
                // Restore application state here.
            }

            // If any history is found in the `sessionState`, we need to
            // restore it for WinJS.
            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            // After we process the UI (search the DOM for winControls),
            // we'll navigate to the current page. These are async operations
            // and they will return a promise.
            var processAndNavigate = WinJS.UI
                .processAll()
                .then(function () {

                    // <SnippetHilojs_1409>
                    if (nav.location) {
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(nav.location, nav.state);
                    } else {
                        return nav.navigate(Hilo.navigator.home);
                    }
                    // </SnippetHilojs_1409>
                });

            // Pass along the promise we just created so that WinJS will know 
            // when our bootstrapping work has completed.
            args.setPromise(processAndNavigate);
        }
    }, false);
    // </SnippetHilojs_1803>

    // <SnippetHilojs_1801>
    app.addEventListener("checkpoint", function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    }, false);
    // </SnippetHilojs_1801>

    // The `resuming` event is not exposed through `WinJS.Application` like
    // the `activated` event. Instead, we need to use the underlying WinRT API.
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", function (args) {
        var tileUpdater = new Hilo.Tiles.TileUpdater();
        tileUpdater.update();
    }, false);

    app.start();
})();
