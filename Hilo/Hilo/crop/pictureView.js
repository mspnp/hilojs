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

    function PictureViewConstructor(canvasContext, rubberBand, imageUrl) {
        this.context = canvasContext;
        this.loadAndDisplayImage(imageUrl);

        rubberBand.addEventListener("move", this.drawImage.bind(this));
    }

    // Picture View Members
    // --------------------

    var pictureViewMembers = {

        loadAndDisplayImage: function (imageUrl) {
            this.image = new Image();
            this.image.onload = this.drawImage.bind(this);
            this.image.src = imageUrl;
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