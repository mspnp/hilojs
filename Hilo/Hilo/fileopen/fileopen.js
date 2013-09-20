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

    Hilo.controls.pages.define("fileopen", {

        ready: function (element, options) {
            var query = options.query;

            var progressIndicator = document.querySelector("#contenthost progress");

            var hiloAppBarEl = document.querySelector("#appbar");
            var hiloAppBar = new Hilo.Controls.HiloAppBar.HiloAppBarPresenter(hiloAppBarEl, WinJS.Navigation, query);

            var filmstripEl = document.querySelector("#filmstrip");
            var flipviewEl = document.querySelector("#flipview");

            var flipviewPresenter = new Hilo.Detail.FlipviewPresenter(flipviewEl);
            var filmstripPresenter = new Hilo.Detail.FilmstripPresenter(filmstripEl);


            var fileOpenPresenter = new Hilo.FileOpen.FileOpenPresenter(filmstripPresenter, flipviewPresenter, hiloAppBar, WinJS.Navigation);
            fileOpenPresenter.addEventListener("pageSelected", function (args) {
                var itemIndex = args.detail.itemIndex;
                options.itemIndex = itemIndex;
            });
            this.promise = fileOpenPresenter
                .start(options)
                .then(function () {
                    progressIndicator.style.display = "none";
                });
        },

        unload: function () {
            this.promise.cancel();
            Hilo.UrlCache.clearAll();
        }
    });

}());
