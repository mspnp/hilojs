(function () {
	"use strict";

	// Constructor Function
	// --------------------

	function RotateController(el, menuController, imageLoaderPromise) {
		this.el = el;
		this.rotationDegrees = 0;
		this.menuController = menuController;
		this.bindToEvents();

		var that = this;
		imageLoaderPromise.then(function (storageFile) {
			that.imageFile = storageFile[0];
		});
	}

	// Methods
	// -------

	var rotateControllerMethods = {
		bindToEvents: function () {
			this.menuController.addEventListener("rotate", this.rotateImage.bind(this));
			this.menuController.addEventListener("reset", this.resetImage.bind(this));
			this.menuController.addEventListener("save", this.saveImage.bind(this));
		},

		rotateImage: function (args) {
			this.rotationDegrees += args.detail.rotateDegrees;
			this._setRotation();
		},

		resetImage: function(){
			this.rotationDegrees = 0;
			this._setRotation();
		},

		showImage: function (url) {
			this.el.src = url;
		},

		saveImage: function () {
			var imageRotator = new Hilo.ImageRotator();
			imageRotator.rotate(this.imageFile, this.rotationDegrees);
		},

		_setRotation: function () {
			var rotation = "rotate(" + this.rotationDegrees + "deg)";
			this.el.style.transform = rotation;
		}
	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo.Rotate", {
		RotateController: WinJS.Class.mix(RotateController, rotateControllerMethods, WinJS.Utilities.eventMixin)
	});

})();