(function () {
	"use strict";

	// Constructor Function
	// --------------------

	function CropControllerConstructor(canvasEl, fileLoader, urlBuilder, rubberBandController) {
	    var that = this;

	    this.canvas = canvasEl;

	    this.context = canvasEl.getContext("2d");
	    this.urlBuilder = urlBuilder;
	    this.rubberBand = rubberBandController;


	    this.rubberBand.addEventListener("move", function () {
	        that.showImage();
	    });

	    fileLoader.then(function (loadedImage) {
			var storageFile = loadedImage[0].storageFile;
			that.imageFile = storageFile;

	        var url = that.urlBuilder.createObjectURL(that.imageFile);
			that.image = new Image();
			that.image.src = url;

			that.image.onload = function () {
			    that.showImage();
			}
	    });
    }

	// Methods
	// -------

	var cropControllerMembers = {

	    showImage: function (loadedImage) {
	        this.context.drawImage(this.image, 0, 0, 600, 800);
        }
	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo.Crop", {
		CropController: WinJS.Class.mix(CropControllerConstructor, cropControllerMembers, WinJS.Utilities.eventMixin)
	});

})();