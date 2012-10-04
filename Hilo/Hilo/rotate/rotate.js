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

            var selectedIndex = options.itemIndex,
                query = options.query,
                expectedName = options.itemName;

            var fileLoader = query.execute(selectedIndex);

            var menuEl = document.querySelector("#appbar");
            var appBarPresenter = new Hilo.Rotate.AppBarPresenter(menuEl);

            var imgEl = document.querySelector("#image");
            this.presenter = new Hilo.Rotate.RotatePresenter(imgEl, appBarPresenter, fileLoader, URL, expectedName);
            this.presenter.start();
        },

        unload: function () {
            this.presenter.dispose();
            delete this.presenter;
        }
    };

    Hilo.controls.pages.define("rotate", page);

}());
