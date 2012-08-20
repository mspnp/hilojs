(function (global) {
	"use strict";

	// SpecRunner Constructor
	// ----------------------

	// This objects searches through the project folder, the specs folder,
	// and the specs helpers folder to find all available JavaScript files.
	// It inserts a script tag in to the DOM for each file it finds.
	//
	// The `options` parameter allows three options to be passed in:
	// * `specs`: the folder to search for `*spec.js` files
	// * `helpers`: a folder that contains helper objects and methods for the specs
	// * `src`: the folder that contains all fo the source files that will be tested

	function SpecRunner(options) {
		this.specFolder = options.specs || "specs";
		this.helperFolder = options.helpers || "specs/helpers";
		this.srcFolder = options.src || "src";
	}

	// SpecRunner Methods
	// ------------------

	var specRunnerMethods = {
		configureMocha: function(){
			global.expect = chai.expect;
			global.mocha.setup("bdd");
		},

		run: function () {
			this.appFolder = Windows.ApplicationModel.Package.current.installedLocation;
			this.configureMocha();

			this.injectHelpers()
				.then(this.injectPageControls.bind(this))
				.then(this.injectSpecList.bind(this))
				.then(this.startTestHarness.bind(this))
				.done(null, this.triggerError.bind(this));
		},

		triggerError: function (error) {
			this.dispatchEvent("error", error);
		},

		startTestHarness: function () {
			global.mocha.run();
		},

		injectPageControls: function () {
			return this.getFolder(this.srcFolder)
				.then(this.getJSFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		injectHelpers: function () {
			return this.getFolder(this.helperFolder)
				.then(this.getJSFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		injectSpecList: function () {
			return this.getFolder(this.specFolder)
				.then(this.getSpecFileNames.bind(this))
				.then(this.buildScriptTags.bind(this))
				.then(this.addScriptsToBody.bind(this));
		},

		getFolder: function (folderName, parentFolder) {
			parentFolder = parentFolder || this.appFolder;

			var names = folderName.split("/");
			var name = names.shift();

			var folder = parentFolder.getFolderAsync(name);
			if (names.length === 0) {

				// Found the final folder. Return it.
				return folder;

			} else {

				// More folders to find. Recursively load them.
				var that = this;
				return folder.then(function (newParent) {
					return that.getFolder(names.join("/"), newParent);
				});

			}
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

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo", {
		SpecRunner: WinJS.Class.mix(SpecRunner, specRunnerMethods, WinJS.Utilities.eventMixin)
	});
})(this);
