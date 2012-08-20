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

            var imgEl = document.querySelector("#image");
            var rotateController = new Hilo.Rotate.RotateController(imgEl, menuController, fileLoader, URL);
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/rotate/rotate.html", page);

}());
