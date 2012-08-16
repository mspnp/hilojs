(function () {
    "use strict";

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

    	ready: function (element, options) {
    		var selectedIndex = options.itemIndex;
    		var query = options.query;
            var fileLoader = query.execute(selectedIndex);

            var menuEl = document.querySelector("#appbar");
            var menuController = new Hilo.Rotate.MenuController(menuEl);

            fileLoader.then(function (selected) {
            	var storageFile = selected[0].storageFile;
            	var imgEl = document.querySelector("#image");

            	var rotateController = new Hilo.Rotate.RotateController(imgEl, menuController, storageFile);

            	var url = URL.createObjectURL(storageFile);
            	rotateController.showImage(url);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/rotate/rotate.html", page);

}());
