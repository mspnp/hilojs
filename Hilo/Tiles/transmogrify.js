(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var notifications = Windows.UI.Notifications;

    // Public API
    // ----------

    WinJS.Namespace.define('Tiles', {

        transmogrifyTile: function (thumbnails) {

            var template = notifications.TileTemplateType.tileWideImageCollection;

            var xml = notifications.TileUpdateManager.getTemplateContent(template);
            var images = xml.getElementsByTagName("image");

            thumbnails.forEach(function (thumbnail, index) {
                var element = images.getAt(index);
                element.attributes.getNamedItem('src').innerText = thumbnail;
            });

            return new WinJS.Promise(function (complete, error, progress) {
                var notification = new notifications.TileNotification(xml);
                complete(notification);
            });
        }
    });

})();