(function () {
	"use strict";

	// Constructor Function
	// --------------------

	function RotateController(el, menuController, storageFile) {
		this.el = el;
		this.menuController = menuController;
		this.imageFile = storageFile;
		this.rotationDegrees = 0;

		this.bindToEvents();
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
			var rotateDegrees = args.detail.rotateDegrees;
			this.rotationDegrees += rotateDegrees;
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