(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var thumbnailFolderName = 'tile-thumbnails',
        localThumbnailFolder = 'ms-appdata:///local/' + thumbnailFolderName + '/';

    // Private Methods
    // ---------------

    var tiles = {
        getLocalThumbnailPaths: function (files) {
            return files.map(function (file) {
                return localThumbnailFolder + file;
            });
        },

        update: function () {
            var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
            var whenImagesForTileRetrieved = Tiles.getImagesForTile();
            var updateTile = updater.update.bind(updater);

            whenImagesForTileRetrieved
                // TODO: reset to default tile
                .then(Tiles.buildThumbails)
                .then(Tiles.getLocalThumbnailPaths)
                // TODO: build notifications
                .then(Tiles.transmogrifyTile) // TODO: this will be invoked multiple times
                // add notifications to queue
                .then(updateTile); // TODO: this will be invoked multiple times
        }
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Tiles', tiles);

})();