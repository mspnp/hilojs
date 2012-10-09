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
            this.appBarPresenter = new Hilo.Rotate.AppBarPresenter(menuEl);

            var imgEl = document.querySelector("#rotate-image");
            this.presenter = new Hilo.Rotate.RotatePresenter(imgEl, this.appBarPresenter, fileLoader, URL, expectedName);
            this.presenter.start();
        },

        unload: function () {
            Hilo.UrlCache.clearAll();

            this.appBarPresenter.dispose();
            delete this.appBarPresenter;

            this.presenter.dispose();
            delete this.presenter;
        }
    };

    Hilo.controls.pages.define("rotate", page);

}());
