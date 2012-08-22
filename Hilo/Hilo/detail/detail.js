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

    var // WinJS
        ui = WinJS.UI,
        nav = WinJS.Navigation,
        knownFolders = Windows.Storage.KnownFolders,
        pages = WinJS.UI.Pages;

    var page = {

        ready: function (element, options) {
            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

            // load the images from the specified query, and show them
            var query = options.query;
            var itemIndex = options.itemIndex;
            query.execute()
                .then(this.showImages.bind(this, query))
                .then(function (controller) {
                    controller.gotoImage(itemIndex);
                });
        },

        showImages: function (query, images) {
            var filmstripEl = document.querySelector("#filmstrip");
            var filmstrip = new Hilo.Detail.FilmstripController(filmstripEl, images);

            var flipviewEl = document.querySelector("#flipview");
            var flipview = new Hilo.Detail.FlipviewController(flipviewEl, images);

            var imageNavEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavController(imageNavEl, WinJS.Navigation, query);
            imageNav.enableButtons();

            var detailPageController = new Hilo.Detail.DetailPageController(flipview, filmstrip, imageNav);
            detailPageController.run();

            return detailPageController;
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    pages.define("/Hilo/detail/detail.html", page);
    return page;

}());
