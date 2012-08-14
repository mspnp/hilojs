(function () {
    "use strict";

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var menuEl = document.querySelector("#appbar");
            var menuController = new Hilo.Rotate.MenuController(menuEl);

            var img = document.querySelector("#image");
            var rotateController = new Hilo.Rotate.RotateController(img, menuController);

            var queryBuilder = new Hilo.ImageQueryBuilder(Windows.Storage.KnownFolders.picturesLibrary);
            queryBuilder.imageAt(selectedIndex);

            queryBuilder.build().execute().then(function (selected) {
            	var url = URL.createObjectURL(selected[0]);
            	rotateController.showImage(url);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/rotate/rotate.html", page);

}());
