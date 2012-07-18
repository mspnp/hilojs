(function () {
    'use strict';
    var notifications = Windows.UI.Notifications;

    WinJS.Namespace.define('Tiles', {

        transmogrify: function (thumbnails) {

            var template = notifications.TileTemplateType.tileWideImageCollection,
                xml = notifications.TileUpdateManager.getTemplateContent(template),
                images = xml.getElementsByTagName("image");

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