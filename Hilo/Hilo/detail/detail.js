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

            var query = options.query;

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            this.bindPageTitle(query.settings.monthAndYear);

            var filmstripEl = document.querySelector("#filmstrip"),
                flipviewEl = document.querySelector("#flipview");

            var imageNavEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(imageNavEl, WinJS.Navigation, query);

            var detailPresenter = new Hilo.Detail.DetailPresenter(filmstripEl, flipviewEl, imageNav);
            detailPresenter.start(options);
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
        }
    };

    Hilo.controls.pages.define("detail", page);

}());
