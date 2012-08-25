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
    		var context = canvasEl.getContext("2d");
    		var rubberBandEl = document.querySelector("#rubberBand");

    		var that = this;
    		fileLoader.then(function (loadedImageArray) {
    		    var picture = loadedImageArray[0];
    		    var storageFile = picture.storageFile;
    		    var url = URL.createObjectURL(storageFile);

    		    that.sizeCanvas(canvasEl, storageFile);

    		    var rubberBand = new Hilo.Crop.RubberBand(canvasEl);
    		    var pictureView = new Hilo.Crop.PictureView(context, rubberBand, url);
    		    var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, canvasEl, rubberBandEl);
    		    var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, canvasEl, rubberBandEl);
    		});


    		//new Hilo.Crop.CropController(canvasEl, rubberBand, rubberBandView, pictureView);
        },

        sizeCanvas: function (canvas) {
            canvas.height = 800;
	        canvas.width = 600;
	    },

    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
