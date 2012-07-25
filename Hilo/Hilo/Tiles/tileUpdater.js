(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var thumbnailFolderName = 'tile-thumbnails',
        localThumbnailFolder = 'ms-appdata:///local/' + thumbnailFolderName + '/',
        notifications = Windows.UI.Notifications,
        maxNumberOfUpdates = 5;

    // Private Methods
    // ---------------

    var tileUpdater = {
        getLocalThumbnailPaths: function (files) {
            return files.map(function (file) {
                return localThumbnailFolder + file;
            });
        },
        
        queueNotification: function (notification) {
            this.tileUpdater.update(notification);
        },

        queueTileUpdates: function (filenames) {
            var queueNotification = this.queueNotification.bind(this);
            for (var i = 1; i <= maxNumberOfUpdates; i++) {

                var whenNotificationIsBuilt = Hilo.Tiles.buildTileNotification(filenames);
                whenNotificationIsBuilt
                    .then(queueNotification);

            }
        },

        update: function () {
            var queueTileUpdates = this.queueTileUpdates.bind(this);

            var whenImagesForTileRetrieved = Hilo.Tiles.getImagesForTile();
            whenImagesForTileRetrieved
                .then(Hilo.Tiles.buildThumbails)
                .then(this.getLocalThumbnailPaths)
                .then(queueTileUpdates);
        }
    }

    function constructor() {
        this.tileUpdater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
        this.tileUpdater.enableNotificationQueue(true);
    }

    // Public API
    // ----------

    var TileUpdater = WinJS.Class.define(constructor, tileUpdater);

    WinJS.Namespace.define('Hilo.Tiles', {
        TileUpdater: TileUpdater
    });

})();