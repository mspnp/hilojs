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

    // Picture View Constructor
    // ------------------------

    function PictureViewConstructor(canvasContext, imageLoaderPromise, urlBuilder) {
        this.context = canvasContext;
        this.urlBuilder = urlBuilder;

        imageLoaderPromise.then(this.loadAndDisplayImage.bind(this));
    }

    // Picture View Members
    // --------------------

    var pictureViewMembers = {

        loadAndDisplayImage: function (loadedImageArray) {
            var picture = loadedImageArray[0];
            this.imageFile = picture.storageFile;

            var url = this.urlBuilder.createObjectURL(this.imageFile);

            this.image = new Image();
            this.image.onload = this.drawImage.bind(this);
			this.image.src = url;
        },

        drawImage: function () {
            if (!this.image) { return; }

            this.context.drawImage(this.image, 0, 0, 600, 800);
        }
    };

    // Picture View Definition
    // -----------------------

    WinJS.Namespace.define("Hilo.Crop", {
        PictureView: WinJS.Class.define(PictureViewConstructor, pictureViewMembers)
    });

})();