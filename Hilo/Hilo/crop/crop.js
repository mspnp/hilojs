(function () {
    'use strict';

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var repo = new Hilo.ImageRepository(Windows.Storage.KnownFolders.picturesLibrary);
            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            section.appendChild(img);
            img.addEventListener('load', function () {
                ui.Animation.fadeIn(img);
            });

            repo.getImageAt(selectedIndex).then(function (selected) {
                img.src = URL.createObjectURL(selected);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define('/Hilo/crop/crop.html', page);
}());
