(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var thumbnailFolderName = 'tile-thumbnails',
        localThumbnailFolder = 'ms-appdata:///local/' + thumbnailFolderName + '/',
        notifications = Windows.UI.Notifications;

    // Private Methods
    // ---------------

    var tiles = {
        getLocalThumbnailPaths: function (files) {
            return files.map(function (file) {
                return localThumbnailFolder + file;
            });
        },

        buildTileNotification: function (thumbnailPaths) {
            var wideTile = Hilo.Tiles.buildWideTile(thumbnailPaths);
            var squareTile = Hilo.Tiles.buildSquareTile(thumbnailPaths);

            var transmogrifiedTile = Hilo.Tiles.transmogrify(wideTile, squareTile);
            var notification = new notifications.TileNotification(transmogrifiedTile);

            return WinJS.Promise.wrap(notification);
        },

        update: function () {
            var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
            var whenImagesForTileRetrieved = Hilo.Tiles.getImagesForTile();
            var updateTile = updater.update.bind(updater);

            whenImagesForTileRetrieved
                .then(Hilo.Tiles.buildThumbails)
                .then(Hilo.Tiles.getLocalThumbnailPaths)
                .then(Hilo.Tiles.buildTileNotification)
                .then(updateTile);
        }
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', tiles);

})();