(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var thumbnailFolderName = 'tile-thumbnails',
        localThumbnailFolder = 'ms-appdata:///local/' + thumbnailFolderName + '/',
        numberOfImagesToRetrieve = 30,
        notifications = Windows.UI.Notifications;

    // Private Methods
    // ---------------

    var tileUpdater = {
        getLocalThumbnailPaths: function (files) {
            return files.map(function (file) {
                return localThumbnailFolder + file;
            });
        },
        
        queueTileUpdates: function (notifications) {
            var that = this;
            notifications.forEach(function (notification) {
                that.tileUpdater.update(notification);
            });
        },

        update: function () {
            var picturesLibrary = Windows.Storage.KnownFolders.picturesLibrary;
            var imageRepo = new Hilo.ImageRepository(picturesLibrary);
            var queueTileUpdates = this.queueTileUpdates.bind(this);

            var whenImagesForTileRetrieved = imageRepo.getImages(numberOfImagesToRetrieve);
            whenImagesForTileRetrieved
                .then(Hilo.Tiles.buildThumbails)
                .then(this.getLocalThumbnailPaths)
                .then(Hilo.Tiles.transmogrify)
                .then(queueTileUpdates);
        }
    }

    function TileUpdater() {
        this.tileUpdater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
        this.tileUpdater.enableNotificationQueue(true);
    }

    WinJS.Namespace.define('Hilo.Tiles', {
        TileUpdater: WinJS.Class.define(TileUpdater, tileUpdater)
    });

})();