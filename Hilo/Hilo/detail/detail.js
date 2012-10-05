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
            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            var query = options.query;
            var queryDate = query.settings.monthAndYear;
            var pageTitle = Hilo.dateFormatter.getMonthFrom(queryDate) + " " + Hilo.dateFormatter.getYearFrom(queryDate);
            this.bindPageTitle(pageTitle);

            // <SnippetHilojs_1711>
            var imageNavEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(imageNavEl, WinJS.Navigation, query);
            // </SnippetHilojs_1711>

            var filmstripEl = document.querySelector("#filmstrip")
            var flipviewEl = document.querySelector("#flipview");

            var detailPresenter = new Hilo.Detail.DetailPresenter(filmstripEl, flipviewEl, imageNav);
            detailPresenter.addEventListener("pageSelected", function (args) {
                var itemIndex = args.detail.itemIndex;
                options.itemIndex = itemIndex;
            });
            detailPresenter.start(options);
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.Picture.revokeUrls();
        }
    };

    Hilo.controls.pages.define("detail", page);

}());
