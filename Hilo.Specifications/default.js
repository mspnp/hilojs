(function () {
    'use strict';

    // # Bootstrapper
    // This script is responsible for bootstrapping the application.

    function runJasmine() {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };

        jasmineEnv.execute();
    }

    var activation = Windows.ApplicationModel.Activation,
        app = WinJS.Application,
        nav = WinJS.Navigation;

    app.addEventListener('activated', function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            args.setPromise(WinJS.UI.processAll().then(function () {

                Shared.copyImagesToIndexedFolder()
                    .then(runJasmine);

            }));
        }
    }, false);

    app.start();
})();
