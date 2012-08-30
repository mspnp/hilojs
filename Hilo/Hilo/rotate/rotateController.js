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

    // Constructor Function
    // --------------------

    function RotateController(el, menuController, fileLoader, urlBuilder) {
        this.el = el;
        this.menuController = menuController;
        this.rotationDegrees = 0;
        this.urlBuilder = urlBuilder;

        this._bindToEvents();

        fileLoader.then(this._loadAndShowImage.bind(this));
    }

    // Methods
    // -------

    var rotateControllerMethods = {
        _bindToEvents: function () {
            this.menuController.addEventListener("rotate", this.rotateImage.bind(this));
            this.menuController.addEventListener("reset", this.resetImage.bind(this));
            this.menuController.addEventListener("save", this.saveImage.bind(this));
        },

        _loadAndShowImage: function (selected) {
            var storageFile = selected[0].storageFile;
            this.imageFile = storageFile;

            var url = this.urlBuilder.createObjectURL(storageFile);
            this.showImage(url);
        },

        _setRotation: function () {
            var rotation = "rotate(" + this.rotationDegrees + "deg)";
            this.el.style.transform = rotation;
        },

        rotateImage: function (args) {
            var rotateDegrees = args.detail.rotateDegrees;
            this.rotationDegrees += rotateDegrees;
            this._setRotation();
        },

        resetImage: function(){
            this.rotationDegrees = 0;
            this._setRotation();
        },

        showImage: function (url) {
            this.el.src = url;
        },

		saveImage: function () {
		    var imageWriter = new Hilo.ImageWriter();
		    var rotateImageWriter = new Hilo.Rotate.RotatedImageWriter(imageWriter);
		    rotateImageWriter.rotate(this.imageFile, this.rotationDegrees);
		}
	};

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Rotate", {
        RotateController: WinJS.Class.mix(RotateController, rotateControllerMethods, WinJS.Utilities.eventMixin)
    });

})();
