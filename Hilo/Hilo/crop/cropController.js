(function () {
	"use strict";

	// Constructor Function
	// --------------------

	function CropControllerConstructor(canvasEl, fileLoader, urlBuilder) {
	    this.canvas = canvasEl;
	    this.context = canvasEl.getContext("2d");
	    this.urlBuilder = urlBuilder;

	    this.sizeCanvas();

	    fileLoader.then(this.showImage.bind(this));
    }

	// Methods
	// -------

	var cropControllerMembers = {

	    sizeCanvas: function () {
	        var parent = this.canvas.parentNode;

	        var parentStyle = window.getComputedStyle(parent);
	        var height = parentStyle.getPropertyValue("height");
	        var width = parentStyle.getPropertyValue("width");

	        this.canvas.height = 800;
	        this.canvas.width = 600;
	    },

	    showImage: function (loadedImage) {
			var storageFile = loadedImage[0].storageFile;
			this.imageFile = storageFile;

			var url = this.urlBuilder.createObjectURL(storageFile);
			var image = new Image();
			image.src = url;

			var that = this;
			image.onload = function () {
			    that.context.drawImage(image, 0, 0, 600, 800);
			}
        }
	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo.Crop", {
		CropController: WinJS.Class.mix(CropControllerConstructor, cropControllerMembers, WinJS.Utilities.eventMixin)
	});

})();