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

	function CropControllerConstructor(canvasBounds, rubberBand, rubberBandView, pictureView) {
	    var that = this;

	    rubberBand.addEventListener("move", this.moveRubberBand.bind(this));
    }

	// Methods
	// -------

	var cropControllerMembers = {
	    moveRubberBand: function (args) {
	    }
	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo.Crop", {
		CropController: WinJS.Class.mix(CropControllerConstructor, cropControllerMembers, WinJS.Utilities.eventMixin)
	});

})();