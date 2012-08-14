(function () {
    "use strict";

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var queryBuilder = new Hilo.ImageQueryBuilder(Windows.Storage.KnownFolders.picturesLibrary);
            queryBuilder.imageAt(selectedIndex);

            var img = document.querySelector("#image");
            queryBuilder.build().execute().then(function (selected) {
                img.src = URL.createObjectURL(selected[0]);
            });

            var menuEl = document.querySelector("#appbar");
            var menuController = new Hilo.Rotate.MenuController(menuEl);

            menuController.addEventListener("rotate", function (args) {
            	rotateImage(args.detail.rotateDegrees);
            });

            var rotation = 0;
            function rotateImage(angle) {
                var style = "rotate(" + rotation + "deg)";
                img.style.transform = style;
                console.log(style);
            }
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/rotate/rotate.html", page);

}());
