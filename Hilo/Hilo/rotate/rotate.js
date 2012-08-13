(function () {
    "use strict";

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var queryBuilder = new Hilo.ImageQueryBuilder(Windows.Storage.KnownFolders.picturesLibrary);
            queryBuilder.imageAt(selectedIndex);

            var section = document.querySelector("section[role='main']");
            section.innerHtml = "";

            var img = document.querySelector("#image");

            queryBuilder.build().execute().then(function (selected) {
                img.src = URL.createObjectURL(selected[0]);
            });

            var clock = document.querySelector("#rotateClockwise");
            var counter = document.querySelector("#rotateCounterclockwise");
            document.querySelector("#appbar").winControl.show();

            var rotation = 0;

            function rotateImage(angle) {
                var style = "rotate(" + rotation + "deg)";
                img.style.transform = style;
                console.log(style);
            }

            clock.addEventListener("click", function (args) {
                rotation += 90;
                rotateImage(rotation);
            });

            counter.addEventListener("click", function (args) {
                rotation -= 90;
                rotateImage(rotation);
            });

        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/rotate/rotate.html", page);

}());
