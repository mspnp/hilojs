// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function (globals) {
	"use strict";

	var activation = Windows.ApplicationModel.Activation,
        app = WinJS.Application,
        nav = WinJS.Navigation;

	function setupImages(exists) {
		var promise;

		if (exists) {
			promise = WinJS.Promise.wrap(exists); /* this is an empty promise */
		} else {
			promise = Shared.copyImagesToIndexedFolder();
		}

		return promise;
	}

	function runSpecs() {
		// configure the spec runner
		var specRunner = new Hilo.SpecRunner({
			src: "Hilo",
			specs: "specs",
			helpers: "specs/Helpers"
		});

		// Handle any errors in the execution that
		// were not part of a failing test
		specRunner.addEventListener("error", function (args) {
			document.querySelector("body").innerText = args.detail;
		});

		// run the specs
		specRunner.run();
	}

	app.addEventListener("activated", function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			args.setPromise(WinJS.UI.processAll().then(function () {

				Shared.doesIndexedFolderExist()
                    .then(setupImages)
					.then(runSpecs);

			}));
		}
	}, false);

	app.start();
})(this);
