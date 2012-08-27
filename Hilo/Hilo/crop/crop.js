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

            var storageFile, url;
            var that = this;
            fileLoader.then(function (loadedImageArray) {

                var picture = loadedImageArray[0];

                storageFile = picture.storageFile;
                url = URL.createObjectURL(storageFile);

                return that.imageScaleSize(storageFile);

            }).then(function (canvasSize) {
                
                that.sizeCanvas(canvasEl, canvasSize);

                var rubberBand = new Hilo.Crop.RubberBand(canvasEl, canvasSize);
                var pictureView = new Hilo.Crop.PictureView(context, rubberBand, url, canvasSize);
                var rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, canvasEl, rubberBandEl, canvasSize);
                var rubberBandController = new Hilo.Crop.RubberBandController(rubberBand, canvasEl, rubberBandEl, canvasSize);

            });
        },

        imageScaleSize: function (storageFile) {
            return new WinJS.Promise(function (complete) {
                storageFile.properties.getImagePropertiesAsync().then(function (props) {

                    var ratio = props.width / props.height;
                    var size = {
                        height: 800,
                        width: 800 * ratio
                    };

                    complete(size);
                });
            });
        },

        sizeCanvas: function (canvas, canvasSize) {
            canvas.height = canvasSize.height;
            canvas.width = canvasSize.width;
        },

    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
