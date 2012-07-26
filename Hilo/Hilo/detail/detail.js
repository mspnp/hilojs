(function () {
    'use strict';

    var // WinJS
        ui = WinJS.UI,
        nav = WinJS.Navigation,
        knownFolders = Windows.Storage.KnownFolders,
        pages = WinJS.UI.Pages;

    var page = {

        ready: function (element, selectedIndex) {

            // TODO: expect this implementation to change

            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            section.appendChild(img);
            img.addEventListener('load', function () {
                ui.Animation.fadeIn(img);
            });

            new Hilo.ImageRepository(knownFolders.picturesLibrary).getImageAt(selectedIndex).then(function (selected) {
                img.src = URL.createObjectURL(selected);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    pages.define('/Hilo/detail/detail.html', page);
    return page;

}());
