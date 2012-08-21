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

    // Private Methods
    // ---------------

    function DetailPageController(flipview, filmstrip, imageNav) {
        this.flipview = flipview;
        this.filmstrip = filmstrip;
        this.imageNav = imageNav;
    }

    var detailPageController = {
        run: function () {
            this.filmstrip.addEventListener("imageInvoked", this.imageClicked.bind(this));
        },

        imageClicked: function (args) {
            var itemIndex = args.detail.itemIndex;
            this.flipview.showImageAt(itemIndex);
            this.imageNav.setImageIndex(itemIndex);
        },

        gotoImage: function (itemIndex) {
            this.flipview.showImageAt(itemIndex);
            this.imageNav.setImageIndex(itemIndex);
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        DetailPageController: WinJS.Class.mix(DetailPageController, detailPageController, WinJS.Utilities.eventMixin)
    });
})();