(function (global) {
	"use strict";

	var runSpecsMethods = {

		run: function (element, options) {
			this.appFolder = Windows.ApplicationModel.Package.current.installedLocation;

			this.injectPageControls()
				.then(this.injectSpecList.bind(this))
				.then(this.startTestHarness.bind(this));
		},

		startTestHarness: function () {
			global.expect = chai.expect;
			mocha.run();
		},

		injectPageControls: function () {
			return this.getPageFolder(this.appFolder)
				.then(this.getPageFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		injectSpecList: function () {
			return this.getSpecFolder(this.appFolder)
				.then(this.getSpecFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		getPageFolder: function (appFolder) {
			return appFolder.getFolderAsync("Hilo");
		},

		getSpecFolder: function (appFolder) {
			return appFolder.getFolderAsync("specs");
		},

		getPageFileNames: function (folder) {
			var nameTest = /.*js$/;
			return this._buildFileListFromRegex(nameTest, folder);
		},

		getSpecFileNames: function (folder) {
			var specTest = /[Ss][Pp][Ee][Cc].*js/;
			return this._buildFileListFromRegex(specTest, folder);
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
		},

		_buildFileListFromRegex: function(regEx, folder){
			var fileQuery = folder.getFilesAsync(Windows.Storage.Search.CommonFileQuery.orderByName);

			return fileQuery.then(function (files) {
				var fileList = files.filter(function (file) {
					return regEx.test(file.name);
				});
				return WinJS.Promise.as(fileList);
			});
		}
	};

	WinJS.Namespace.define("Hilo", {
		runSpecs: runSpecsMethods.run.bind(runSpecsMethods)
	});
})(this);
