(function () {
    'use strict';

    var // WinJS
        ui = WinJS.UI,
        nav = WinJS.Navigation,
        knownFolders = Windows.Storage.KnownFolders,
        pages = WinJS.UI.Pages;

    var page = {

        ready: function (element, selectedIndex) {
            var repo = new Hilo.ImageRepository(knownFolders.picturesLibrary);

            repo.getBindableImages(15).then(function (images) {
                var filmstripEl = document.querySelector("#filmstrip");
                var filmstrip = new Hilo.Detail.FilmstripController(filmstripEl, images);

                var flipviewEl = document.querySelector("#flipview");
                var flipview = new Hilo.Detail.FlipviewController(flipviewEl, images);

                var detailPageController = new Hilo.Detail.DetailPageController(flipview, filmstrip);
                detailPageController.run();
            });

            //var section = document.querySelector('section[role="main"]');
            //section.innerHtml = '';

            //var img = document.createElement('img');
            //section.appendChild(img);
            //img.addEventListener('load', function () {
            //    ui.Animation.fadeIn(img);
            //});

            //new Hilo.ImageRepository(knownFolders.picturesLibrary).getImageAt(selectedIndex).then(function (selected) {
            //    img.src = URL.createObjectURL(selected);
            //});
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    pages.define('/Hilo/detail/detail.html', page);
    return page;

}());
