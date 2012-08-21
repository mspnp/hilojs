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
    		var controller = new Hilo.Crop.CropController(canvasEl, fileLoader, URL);

    		var rubberBandEl = document.querySelector("#rubberBand");
    		this.rubberBandController = new Hilo.Crop.RubberBandController(canvasEl, rubberBandEl);
        },

        unload: function () {
            delete this.rubberBandController;
        }
    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
