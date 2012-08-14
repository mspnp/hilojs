(function () {
	"use strict";
	
	// Imports And Constants
	// ---------------------
	var rotateClockwiseInDegrees = 90,
		rotateCounterClockwiseInDegrees = -90,
		rotateDefaultInDegrees = 0;

	// Menu Controller Constructor
	// ---------------------------

	function MenuController(el) {
		this.el = el;
		this.menu = el.winControl;

		this.setupButtons();
		this.menu.show();
	}

	// Menu Controller Methods
	// -----------------------

	var menuControllerMethods = {
		setupButtons: function () {
			this.clockwiseButton = this.el.querySelector("#clockwise").winControl;
			this.clockwiseButton.addEventListener("click", this.rotateClockwise.bind(this));

			this.counterClockwiseButton = this.el.querySelector("#counterClockwise").winControl;
			this.counterClockwiseButton.addEventListener("click", this.rotateCounterClockwise.bind(this));

			this.saveButton = this.el.querySelector("#save").winControl;
			this.saveButton.addEventListener("click", this.saveChanges.bind(this));

			this.cancelButton = this.el.querySelector("#cancel").winControl;
			this.cancelButton.addEventListener("click", this.cancelChanges.bind(this));

			this._disableButtons();
		},

		rotateClockwise: function (args) {
			this._enableButtons();

			this.dispatchEvent("rotate", {
				rotateDegrees: rotateClockwiseInDegrees
			});
		},

		rotateCounterClockwise: function (args) {
			this._enableButtons();

			this.dispatchEvent("rotate", {
				rotateDegrees: rotateCounterClockwiseInDegrees
			});
		},

		saveChanges: function () {
			this._disableButtons();
			this.dispatchEvent("save", {});
		},

		cancelChanges: function () {
			this._disableButtons();

			this.dispatchEvent("rotate", {
				rotateDegrees: rotateDefaultInDegrees
			});

			this.dispatchEvent("cancel", {});
		},

		_enableButtons: function () {
			this.saveButton.disabled = false;
			this.cancelButton.disabled = false;
		},

		_disableButtons: function () {
			this.saveButton.disabled = true;
			this.cancelButton.disabled = true;
		}
	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo.Rotate", {
		MenuController: WinJS.Class.mix(MenuController, menuControllerMethods, WinJS.Utilities.eventMixin)
	});

})();