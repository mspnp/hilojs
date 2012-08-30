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

    // Page Control
    // ------------

    var page = {

        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

            var selectedIndex = options.itemIndex;
            var query = options.query;
            var fileLoader = query.execute(selectedIndex);

            var canvasEl = document.querySelector("#cropSurface");
            var cropSelectionEl = document.querySelector("#cropSelection");
            var menuEl = document.querySelector("#appbar");

            var imageWriter = new Hilo.ImageWriter();
            var cropImageWriter = new Hilo.Crop.CroppedImageWriter(imageWriter);

            var cropController = new Hilo.Crop.CropController(fileLoader, canvasEl, cropSelectionEl, menuEl, cropImageWriter);
            cropController.start();
        },

    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
