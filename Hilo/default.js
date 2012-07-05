(function () {
    'use strict';

    // # Bootstrapper
    // This script is responsible for bootstrapping the application.

    var activation = Windows.ApplicationModel.Activation,

        app = WinJS.Application,
        nav = WinJS.Navigation;

    WinJS.strictProcessing();

    app.addEventListener('loaded', function (args) {
        require('Hilo.PageControlNavigator');
    });

    app.addEventListener('activated', function (args) {

        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
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

    app.addEventListener('checkpoint', function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    }, false);

    app.start();
})();
