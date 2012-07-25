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

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {
        transmogrify: transmogrify
    });

})();