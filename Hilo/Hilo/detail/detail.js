// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Page Control
    // ------------

    var page = {

        // <SnippetHilojs_1203>
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

            var filmstripEl = document.querySelector("#filmstrip");
            var flipviewEl = document.querySelector("#flipview");

            var detailPresenter = new Hilo.Detail.DetailPresenter(filmstripEl, flipviewEl, imageNav);
            detailPresenter.addEventListener("pageSelected", function (args) {
                var itemIndex = args.detail.itemIndex;
                options.itemIndex = itemIndex;
            });
            detailPresenter.start(options);
        },
        // </SnippetHilojs_1203>

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
        }
    };

    Hilo.controls.pages.define("detail", page);

}());
