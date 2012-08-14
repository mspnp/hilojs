﻿(function () {
	"use strict";

	// Constructor Function
	// --------------------

	function RotateController(el, menuController) {
		this.el = el;
		this.rotationDegrees = 0;
		this.menuController = menuController;
		this.bindToEvents();
	}

	// Methods
	// -------

	var rotateControllerMethods = {
		bindToEvents: function () {
			this.menuController.addEventListener("rotate", this.rotateImage.bind(this));
			this.menuController.addEventListener("reset", this.resetImage.bind(this));
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