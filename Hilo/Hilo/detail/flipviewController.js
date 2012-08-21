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

    function FlipviewController(el, images) {
        this.el = el;
        this.winControl = el.winControl;
        this.bindImages(images);
    }

    var flipviewController = {
        bindImages: function (images) {
            this.winControl.itemDataSource = new WinJS.Binding.List(images).dataSource;
        },

        showImageAt: function (index) {
            this.winControl.currentPage = index;
        }
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        FlipviewController: WinJS.Class.mix(FlipviewController, flipviewController, WinJS.Utilities.eventMixin)
    });

})();