// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Filmstrip Presenter Constructor
    // -------------------------------

    function FilmstripPresenterConstructor(el, images) {
        this.el = el;
        this.winControl = el.winControl;
        this.setupControlHandlers();
        this.bindImages(images);
    }

    // Filmstrip Presenter Members
    // ---------------------------

    var filmstripPresenterMembers = {
        bindImages: function (images) {
            this.winControl.itemDataSource = new WinJS.Binding.List(images).dataSource;
        },

        setupControlHandlers: function () {
            this.winControl.addEventListener("iteminvoked", this.itemClicked.bind(this));
        },

        getSelectedIndices: function () {
            return this.winControl.selection.getIndices();
        },

        itemClicked: function (args) {
            this.dispatchEvent("imageInvoked", {
                itemIndex: args.detail.itemIndex,
                itemPromise: args.detail.itemPromise
            });
        }
    }

    // Filmstrip Presenter Definition
    // ------------------------------

    WinJS.Namespace.define("Hilo.Detail", {
        FilmstripPresenter: WinJS.Class.mix(FilmstripPresenterConstructor, filmstripPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();