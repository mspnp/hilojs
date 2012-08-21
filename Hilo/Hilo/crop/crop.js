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

    //TODO: temporary implementation

    var ui = WinJS.UI,
        nav = WinJS.Navigation;

    var page = {

        ready: function (element, selectedIndex) {
            var queryBuilder = new Hilo.ImageQueryBuilder();
            queryBuilder.imageAt(selectedIndex);

            var section = document.querySelector("section[role='main']");
            section.innerHtml = "";

            var img = document.createElement("img");
            section.appendChild(img);
            img.addEventListener("load", function () {
                ui.Animation.fadeIn(img);
            });

            var query = queryBuilder.build(Windows.Storage.KnownFolders.picturesLibrary);
            query.execute().then(function (selected) {
                img.src = URL.createObjectURL(selected[0]);
            });
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    WinJS.UI.Pages.define("/Hilo/crop/crop.html", page);
}());
