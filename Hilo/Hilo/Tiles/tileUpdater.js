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
        
        queueTileUpdates: function (notifications) {
            var that = this;
            notifications.forEach(function (notification) {
                that.tileUpdater.update(notification);
            });
        },

        buildTileNotificationList: function (filenames) {
            var notifications = [];

            for (var i = 1; i <= maxNumberOfUpdates; i++) {
                var notification = Hilo.Tiles.buildTileNotification(filenames);
                notifications.push(notification);
            };

            return WinJS.Promise.wrap(notifications);
        },

        update: function () {
            var picturesLibrary = Windows.Storage.KnownFolders.picturesLibrary;
            var imageRepo = new Hilo.ImageRepository(picturesLibrary);
            var queueTileUpdates = this.queueTileUpdates.bind(this);

            var whenImagesForTileRetrieved = imageRepo.getImages(5);
            whenImagesForTileRetrieved
                .then(Hilo.Tiles.buildThumbails)
                .then(this.getLocalThumbnailPaths)
                .then(this.buildTileNotificationList)
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