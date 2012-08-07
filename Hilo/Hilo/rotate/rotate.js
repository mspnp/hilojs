(function () {
    'use strict';

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var queryBuilder = new Hilo.ImageQueryBuilder(Windows.Storage.KnownFolders.picturesLibrary);
            queryBuilder.imageAt(selectedIndex);

            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            section.appendChild(img);
            img.addEventListener('load', function () {
                ui.Animation.fadeIn(img);
            });

            queryBuilder.build().execute().then(function (selected) {
                img.src = URL.createObjectURL(selected[0]);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define('/Hilo/rotate.html', page);

}());
