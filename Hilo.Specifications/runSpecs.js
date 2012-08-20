(function (global) {
	"use strict";

	var runSpecsMethods = {

		run: function (element, options) {
			this.appFolder = Windows.ApplicationModel.Package.current.installedLocation;

			this.configureMocha();

			this.injectHelpers()
				.then(this.injectPageControls.bind(this))
				.then(this.injectSpecList.bind(this))
				.then(this.startTestHarness.bind(this))
				.done(null, this.showError.bind(this));
		},

		configureMocha: function(){
			global.expect = chai.expect;
			global.mocha.setup("bdd");
		},

		startTestHarness: function () {
			global.mocha.run();
		},

		injectPageControls: function () {
			return this.getFolder("Hilo")
				.then(this.getJSFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		injectHelpers: function(){
			return this.getFolder("specs")
				.then(this.getFolder.bind(this, "Helpers"))
				.then(this.getJSFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		injectSpecList: function () {
			return this.getFolder("specs")
				.then(this.getSpecFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		showError: function (error) {
			debugger;
			document.querySelector("#mocha").innerHtml = error;
		},

		getFolder: function (name, folder) {
			folder = folder || this.appFolder;
			return folder.getFolderAsync(name);
		},

		getJSFileNames: function (folder) {
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
