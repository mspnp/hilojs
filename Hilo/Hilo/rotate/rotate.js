// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Page Control
    // ------------

    var page = {

        ready: function (element, options) {

            var selectedIndex = options.itemIndex,
                query = options.query,
                expectedName = options.itemName;

            var fileLoader = query.execute(selectedIndex);

            var menuEl = document.querySelector("#appbar");
            this.appBarPresenter = new Hilo.Rotate.AppBarPresenter(menuEl);

            var touchProvider = new Hilo.Rotate.TouchProvider(element);

            var imgEl = document.querySelector("#rotate-image");
            this.presenter = new Hilo.Rotate.RotatePresenter(imgEl, this.appBarPresenter, fileLoader, expectedName, touchProvider);
            this.presenter.start();
        },

        unload: function () {
            Hilo.UrlCache.clearAll();

            this.appBarPresenter.dispose();
            this.appBarPresenter = null;

            this.presenter.dispose();
            this.presenter = null;
        }
    };

    Hilo.controls.pages.define("rotate", page);

}());
