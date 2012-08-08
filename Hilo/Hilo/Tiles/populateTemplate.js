(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var templates = Windows.UI.Notifications.TileTemplateType,
        tileUpdateManager = Windows.UI.Notifications.TileUpdateManager;

    // Private Methods
    // ---------------

    function buildWideTile(thumbnailFilePaths) {

        var template = templates.tileWideImageCollection;

        var xml = tileUpdateManager.getTemplateContent(template);
        var images = xml.getElementsByTagName("image");

        thumbnailFilePaths.forEach(function (thumbnailFilePath, index) {
            var element = images.getAt(index);
            element.attributes.getNamedItem('src').innerText = thumbnailFilePath;
        });

        return xml;
    }

    function buildSquareTile(thumbnailFilePath) {
        var template = templates.tileSquareImage;
        var xml = tileUpdateManager.getTemplateContent(template);

        var imageTags = xml.getElementsByTagName("image");
        imageTags[0].setAttribute("src", thumbnailFilePath);

        return xml;
    }

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.Tiles.populateTemplate', {
        wideTile: buildWideTile,
        squareTile: buildSquareTile
    });

})();