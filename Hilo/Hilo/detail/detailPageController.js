﻿(function () {
    'use strict';

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
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        DetailPageController: WinJS.Class.mix(DetailPageController, detailPageController, WinJS.Utilities.eventMixin)
    });
})();