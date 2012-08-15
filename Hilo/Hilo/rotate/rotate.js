(function () {
    "use strict";

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var queryBuilder = new Hilo.ImageQueryBuilder();
            var query = queryBuilder
				.imageAt(selectedIndex)
				.build(Windows.Storage.KnownFolders.picturesLibrary);
            var fileLoader = query.execute();

            var menuEl = document.querySelector("#appbar");
            var menuController = new Hilo.Rotate.MenuController(menuEl);

            var imgEl = document.querySelector("#image");
            var rotateController = new Hilo.Rotate.RotateController(imgEl, menuController, fileLoader);

            fileLoader.then(function (selected) {
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
