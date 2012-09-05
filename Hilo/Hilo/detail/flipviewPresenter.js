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

    // Flipview Presenter Constructor
    // ------------------------------

    function FlipviewPresenterConstructor(el, images) {
        this.el = el;
        this.winControl = el.winControl;
        this.bindImages(images);
    }

    // Flipview Presenter Members
    // --------------------------

    var flipviewPresenterMembers = {
        bindImages: function (images) {
            this.winControl.itemDataSource = new WinJS.Binding.List(images).dataSource;
        },

        showImageAt: function (index) {
            this.winControl.currentPage = index;
        }
    }

    // Flipview Presenter Definition
    // -----------------------------

    WinJS.Namespace.define("Hilo.Detail", {
        FlipviewPresenter: WinJS.Class.mix(FlipviewPresenterConstructor, flipviewPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();