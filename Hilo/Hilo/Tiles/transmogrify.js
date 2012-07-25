(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var notifications = Windows.UI.Notifications,
        maxNumberOfUpdates = 5,          // WinRT limits 5 tile notifications per app
        numberOfImagesPerTileSet = 6;    // 5 for wide tile + 1 for square tile

    // Private Methods
    // ---------------

    function buildCompositeTile(wideTile, squareTile) {
        var squareBinding = squareTile.getElementsByTagName("binding").item(0);
        var node = wideTile.importNode(squareBinding, true);
        wideTile.getElementsByTagName("visual").item(0).appendChild(node);

        return wideTile;
    }

    function buildTileNotification(thumbnailPaths) {
        var squareTileFile = thumbnailPaths.shift();
        var squareTile = Hilo.Tiles.buildSquareTile(squareTileFile);
        var wideTile = Hilo.Tiles.buildWideTile(thumbnailPaths);

        var compositeTile = buildCompositeTile(wideTile, squareTile);
        var notification = new notifications.TileNotification(compositeTile);

        return notification;
    }
    
    function buildImageSetForTile(imageNames, numberOfImages) {
        var imageSet = [];

        var max = Math.max(numberOfImages, imageNames.length) - 1;
 
        for (var i = 1; i <= numberOfImages; i++) {
            var imageNumber = parseInt(Math.random() * max, 10);
            var imageName = imageNames[imageNumber];
            imageSet.push(imageName);
        }

        return imageSet;
    }

    function transmogrify(filenames) {
        var notifications = [];

        for (var i = 1; i <= maxNumberOfUpdates; i++) {

            var tileFileNames = buildImageSetForTile(filenames, numberOfImagesPerTileSet)
            var notification = buildTileNotification(tileFileNames);
            notifications.push(notification);

        };

        return WinJS.Promise.wrap(notifications);
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {
        transmogrify: transmogrify
    });

})();