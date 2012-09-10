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

            // load the images from the specified query, and show them
            var query = options.query;
            var itemIndex = options.itemIndex;

            // bind the title based on the query's month/year
            var pageTitle = document.querySelector("#pageTitle");
            WinJS.Binding.processAll(pageTitle, { title: query.settings.monthAndYear });

            query.execute()
                .then(this.showImages.bind(this, query))
                .then(function (presenter) {
                    presenter.gotoImage(itemIndex);
                });
        },

        showImages: function (query, images) {
            var filmstripEl = document.querySelector("#filmstrip");
            var filmstrip = new Hilo.Detail.FilmstripPresenter(filmstripEl, images);

            var flipviewEl = document.querySelector("#flipview");
            var flipview = new Hilo.Detail.FlipviewPresenter(flipviewEl, images);

            var imageNavEl = document.querySelector("#appbar");
            var imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(imageNavEl, WinJS.Navigation, query);
            imageNav.enableButtons();

            var detailPresenter = new Hilo.Detail.DetailPresenter(flipview, filmstrip, imageNav);
            detailPresenter.run();

            return detailPresenter;
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
        }
    };

    Hilo.controls.pages.define("detail", page);

}());
