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

    // Detail Presenter Constructor
    // ----------------------------

    function DetailPresenterConstructor(flipview, filmstrip, imageNav) {
        this.flipview = flipview;
        this.filmstrip = filmstrip;
        this.imageNav = imageNav;
    }

    // Detail Presenter Members
    // ------------------------

    var detailPresenterMembers = {
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

    // Detail Presenter Definition
    // ---------------------------

    WinJS.Namespace.define("Hilo.Detail", {
        DetailPresenter: WinJS.Class.mix(DetailPresenterConstructor, detailPresenterMembers, WinJS.Utilities.eventMixin)
    });
})();