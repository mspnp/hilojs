(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var notifications = Windows.UI.Notifications;

    // Private Methods
    // ---------------

    function buildWideTile(thumbnailFilePaths) {

        var template = notifications.TileTemplateType.tileWideImageCollection;

        var xml = notifications.TileUpdateManager.getTemplateContent(template);
        var images = xml.getElementsByTagName("image");

        thumbnailFilePaths.forEach(function (thumbnailFilePath, index) {
            var element = images.getAt(index);
            element.attributes.getNamedItem('src').innerText = thumbnailFilePath;
        });

        return xml;
    }

    function buildSquareTile(thumbnailFilePath) {
        var template = notifications.TileTemplateType.tileSquareImage;
        var xml = notifications.TileUpdateManager.getTemplateContent(template);

        var imageTags = xml.getElementsByTagName("image");
        imageTags[0].setAttribute("src", thumbnailFilePath);

        return xml;
    }

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.Tiles', {
        buildWideTile: buildWideTile,
        buildSquareTile: buildSquareTile
    });

})();