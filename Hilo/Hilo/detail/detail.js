(function () {
    'use strict';

    var // WinJS
        ui = WinJS.UI,
        nav = WinJS.Navigation,
        knownFolders = Windows.Storage.KnownFolders,
        pages = WinJS.UI.Pages;

    var page = {

        ready: function (element, options) {
            var repo = new Hilo.ImageRepository(knownFolders.picturesLibrary);

            repo.getFromQueryString(options.query).then(this.showImages.bind(this));
        },

        showImages: function (images) {
            var filmstripEl = document.querySelector("#filmstrip");
            var filmstrip = new Hilo.Detail.FilmstripController(filmstripEl, images);

            var flipviewEl = document.querySelector("#flipview");
            var flipview = new Hilo.Detail.FlipviewController(flipviewEl, images);

            var detailPageController = new Hilo.Detail.DetailPageController(flipview, filmstrip);
            detailPageController.run();
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    pages.define('/Hilo/detail/detail.html', page);
    return page;

}());
