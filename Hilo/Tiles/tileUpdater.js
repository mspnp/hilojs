(function () {
    'use strict';

    WinJS.Namespace.define('Tiles', {

        update: function () {

            var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();

            Tiles.getImagesForTile()
                .then(Tiles.buildThumbails)
                .then(Tiles.transmogrify)
                .then(function (notification) {
                    updater.update(notification);
                });
        }
    });

})();