(function (globals) {
    "use strict";

    var activation = Windows.ApplicationModel.Activation,
        app = WinJS.Application,
        nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            args.setPromise(WinJS.UI.processAll().then(function () {

            	Shared.doesIndexedFolderExist()
                    .then(function (exists) {

                    	var promise;

                    	if (exists) {
                    		promise = WinJS.Promise.wrap(exists); /* this is an empty promise */
                    	} else {
                    		promise = Shared.copyImagesToIndexedFolder();
                    	}

                    	return promise;
                    }).done(function () {
                    	Hilo.runSpecs();
                    });

            }));
        }
    }, false);

    app.start();
})(this);
