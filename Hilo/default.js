(function () {
    "use strict";

    // # Bootstrapper
    // This script is responsible for bootstrapping the application.

    var activation = Windows.ApplicationModel.Activation,
        app = WinJS.Application,
        nav = WinJS.Navigation;

    WinJS.strictProcessing();

    Windows.Globalization.ApplicationLanguages.primaryLanguageOverride = "en-US"
    //Windows.Globalization.ApplicationLanguages.primaryLanguageOverride = "de-DE"

    nav.addEventListener("navigated", function () {
        WinJS.Resources.processAll();
    });
    
    app.addEventListener("activated", function (args) {

        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                
                // When the app is launched, we want to update its tile
                // on the start screen
                var tileUpdater = new Hilo.Tiles.TileUpdater();
                tileUpdater.update();

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Hilo.navigator.home);
                }
            }));
        }
    }, false);

    app.addEventListener("checkpoint", function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    }, false);

    app.start();
})();
