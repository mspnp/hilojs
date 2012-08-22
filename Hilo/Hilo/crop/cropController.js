// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
	"use strict";

	// Constructor Function
	// --------------------

	function CropControllerConstructor(canvasEl, fileLoader, urlBuilder, rubberBand, rubberBandView) {
	    var that = this;

	    this.canvas = canvasEl;
	    this.context = canvasEl.getContext("2d");

	    this.urlBuilder = urlBuilder;
	    this.rubberBandView = rubberBandView;

	    rubberBand.addEventListener("move", this.moveRubberBand.bind(this));
	    fileLoader.then(this.loadImage.bind(this));
    }

	// Methods
	// -------

	var cropControllerMembers = {
        loadImage: function (loadedImage) {
            var storageFile = loadedImage[0].storageFile;
            var imageFile = storageFile;
            var url = this.urlBuilder.createObjectURL(imageFile);

			this.image = new Image();
			this.image.src = url;
			this.image.onload = this.showImage.bind(this);
        },

	    showImage: function (loadedImage) {
	        this.context.drawImage(this.image, 0, 0, 600, 800);
	    },

	    moveRubberBand: function (args) {
	        this.showImage();
            this.rubberBandView.draw(args.detail.coords);
	    }
	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo.Crop", {
		CropController: WinJS.Class.mix(CropControllerConstructor, cropControllerMembers, WinJS.Utilities.eventMixin)
	});

})();