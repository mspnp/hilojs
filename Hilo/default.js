(function () {
    'use strict';

    var
        activation = Windows.ApplicationModel.Activation,

        app = WinJS.Application,
        nav = WinJS.Navigation;

    WinJS.strictProcessing();

    function processModules(root) {
        var registration,
            module;

        for (registration in root) {
            module = root[registration];

            root[registration] = require('Hilo.' + registration);
        }
    }

    app.addEventListener('loaded', function () {
        if (!Hilo) throw new Error('Expected Hilo to be defined before the Application.loaded event');
        processModules(Hilo);
    }, false);

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

                document.querySelector('#contenthost').winControl.addEventListener('afterrender', function () {
                    for (var page in Hilo.pages) {
                        if (Hilo.pages[page].isFactory) {
                            Hilo.pages[page] = require('Hilo.pages.' + page);
                        }
                    }
                }, false);

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
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
