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

    // Page Control
    // ------------

    var page = {

        ready: function (element, options) {

            var selectedIndex = options.itemIndex;
            var query = options.query;
            var fileLoader = query.execute(selectedIndex);

            var menuEl = document.querySelector("#appbar");
            var appBarPresenter = new Hilo.Rotate.AppBarPresenter(menuEl);

            var imgEl = document.querySelector("#image");
            new Hilo.Rotate.RotatePresenter(imgEl, appBarPresenter, fileLoader, URL);
        },

        unload: function () {
        }
    };

    Hilo.controls.pages.define("rotate", page);

}());
