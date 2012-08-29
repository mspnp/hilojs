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

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

            var selectedIndex = options.itemIndex;
            var query = options.query;
            var fileLoader = query.execute(selectedIndex);

            var menuEl = document.querySelector("#appbar");
            var menuController = new Hilo.Rotate.MenuController(menuEl);

            var imgEl = document.querySelector("#image");
            var rotateController = new Hilo.Rotate.RotateController(imgEl, menuController, fileLoader, URL);
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/rotate/rotate.html", page);

}());
