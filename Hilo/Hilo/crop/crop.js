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

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

    		var selectedIndex = options.itemIndex;
    		var query = options.query;
    		var fileLoader = query.execute(selectedIndex);

    		var canvasEl = document.querySelector("#cropSurface");
    		var rubberBandEl = document.querySelector("#rubberBand");

    		this.sizeCanvas(canvasEl);

    		var rubberBand = new Hilo.Crop.RubberBand(canvasEl);
    		var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, canvasEl, rubberBandEl);
    		var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, canvasEl, rubberBandEl);

    		new Hilo.Crop.CropController(canvasEl, fileLoader, URL, rubberBand, rubberBandView);
        },

        sizeCanvas: function (canvas) {
            canvas.height = 800;
	        canvas.width = 600;
	    },

    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
