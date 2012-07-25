(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var notifications = Windows.UI.Notifications;

    // Private Methods
    // ---------------

    function transmogrify(wideTile, squareTile) {
        var squareBinding = squareTile.getElementsByTagName("binding").item(0);
        var node = wideTile.importNode(squareBinding, true);
        wideTile.getElementsByTagName("visual").item(0).appendChild(node);

        return wideTile;
    }

    function buildTileNotification(thumbnailPaths) {
        var wideTile = Hilo.Tiles.buildWideTile(thumbnailPaths);
        var squareTile = Hilo.Tiles.buildSquareTile(thumbnailPaths);

        var transmogrifiedTile = Hilo.Tiles.transmogrify(wideTile, squareTile);
        var notification = new notifications.TileNotification(transmogrifiedTile);

        return notification;
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {
        transmogrify: transmogrify,
        buildTileNotification: buildTileNotification
    });

})();