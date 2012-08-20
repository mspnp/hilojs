(function (global) {
	"use strict";

	var runSpecsMethods = {

		run: function (element, options) {
			this.injectSpecList()
				.then(this.startTestHarness);
		},

		startTestHarness: function () {
			global.expect = chai.expect;
			mocha.run();
		},

		injectSpecList: function () {
			this.appFolder = Windows.ApplicationModel.Package.current.installedLocation;
			return this.getSpecFolder(this.appFolder)
				.then(this.getSpecFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		getSpecFolder: function (appFolder) {
			return appFolder.getFolderAsync("specs");
		},

		getSpecFileNames: function (specFolder) {
			var specTest = /[Ss][Pp][Ee][Cc]/;
			var fileQuery = specFolder.getFilesAsync(Windows.Storage.Search.CommonFileQuery.orderByName);

			return fileQuery.then(function (files) {
				var fileList = files.filter(function (file) {
					return specTest.test(file.name);
				});
				return WinJS.Promise.as(fileList);
			});
		},

		buildScriptTags: function (fileList) {
			var appPath = this.appFolder.path;

			var specList = fileList.map(function (file) {
				var filePath = file.path.replace(appPath, "");
				var scriptEl = document.createElement("script");
				scriptEl.setAttribute("src", filePath);

				return scriptEl;
			});

			return WinJS.Promise.as(specList);
		},

		addScriptsToBody: function (scriptTags) {
			var body = document.querySelector("body");
			scriptTags.forEach(function (tag) {
				body.appendChild(tag);
			});

			return WinJS.Promise.as(true);
		}
	};

	WinJS.Namespace.define("Hilo", {
		runSpecs: runSpecsMethods.run.bind(runSpecsMethods)
	});
})(this);
