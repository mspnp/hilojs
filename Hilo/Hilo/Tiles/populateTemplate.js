// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";

    // Imports And Variables
    // ---------------------
    var templates = Windows.UI.Notifications.TileTemplateType,
        tileUpdateManager = Windows.UI.Notifications.TileUpdateManager;

    // Private Methods
    // ---------------

    // <SnippetHilojs_1007>
    function buildWideTile(thumbnailFilePaths) {

        // For more information about the `TileWideImageCollection` template, see:
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx#TileWideImageCollection
        var template = templates.tileWideImageCollection;

        var xml = tileUpdateManager.getTemplateContent(template);
        var images = xml.getElementsByTagName("image");

        thumbnailFilePaths.forEach(function (thumbnailFilePath, index) {
            var element = images.getAt(index);
            element.attributes.getNamedItem("src").innerText = thumbnailFilePath;
        });

        return xml;
    }
    // </SnippetHilojs_1007>

    function buildSquareTile(thumbnailFilePath) {
        // For more information about the `TileSquareImage` template, see:
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx#square_image-only_templates
        var template = templates.tileSquareImage;
        var xml = tileUpdateManager.getTemplateContent(template);

        var imageTags = xml.getElementsByTagName("image");
        imageTags[0].setAttribute("src", thumbnailFilePath);

        return xml;
    }

    // Export Public API
    // -----------------

    WinJS.Namespace.define("Hilo.Tiles.populateTemplate", {
        wideTile: buildWideTile,
        squareTile: buildSquareTile
    });

})();