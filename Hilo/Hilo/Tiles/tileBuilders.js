(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var notifications = Windows.UI.Notifications;

    // Private Methods
    // ---------------

    function buildWideTile(thumbnails) {

        var template = notifications.TileTemplateType.tileWideImageCollection;

        var xml = notifications.TileUpdateManager.getTemplateContent(template);
        var images = xml.getElementsByTagName("image");

        thumbnails.forEach(function (thumbnail, index) {
            var element = images.getAt(index);
            element.attributes.getNamedItem('src').innerText = thumbnail;
        });

        return xml;
    }

    function buildSquareTile(thumbnails) {
        var template = notifications.TileTemplateType.tileSquareImage;
        var xml = notifications.TileUpdateManager.getTemplateContent(template);

        var imageTags = xml.getElementsByTagName("image");
        imageTags[0].setAttribute("src", thumbnails[0]);

        return xml;
    }

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.Tiles', {
        buildWideTile: buildWideTile,
        buildSquareTile: buildSquareTile
    });

})();