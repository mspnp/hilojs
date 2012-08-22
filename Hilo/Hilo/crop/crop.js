// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";

    var page = {

        ready: function (element, options) {
    		var selectedIndex = options.itemIndex;
    		var query = options.query;
    		var fileLoader = query.execute(selectedIndex);

    		var canvasEl = document.querySelector("#cropSurface");
    		var rubberBandEl = document.querySelector("#rubberBand");

    		this.sizeCanvas(canvasEl);

    		var rubberBandView = new Hilo.Crop.RubberBandView(canvasEl, rubberBandEl);
    		var rubberBandController = new Hilo.Crop.RubberBandController(canvasEl, rubberBandEl);

    		new Hilo.Crop.CropController(canvasEl, fileLoader, URL, rubberBandController, rubberBandView);
        },

        sizeCanvas: function (canvas) {
            canvas.height = 800;
	        canvas.width = 600;
	    },

    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
