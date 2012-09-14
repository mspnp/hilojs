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

    // Detail Presenter Constructor
    // ----------------------------

    function DetailPresenterConstructor(filmstripEl, flipviewEl, imageNav) {
        this.flipviewEl = flipviewEl;
        this.filmstripEl = filmstripEl;
        this.imageNav = imageNav;
    }

    // Detail Presenter Members
    // ------------------------

    var detailPresenterMembers = {

        start: function (options) {
            var self = this;
            this.query = options.query;

            return this.query.execute()
                .then(this.bindImages.bind(this))
                .then(function () {
                    self.gotoImage(options.itemIndex, options.itemName);
                });
        },

        bindImages: function (images) {

            this.flipview = new Hilo.Detail.FlipviewPresenter(this.flipviewEl, images);
            this.flipview.addEventListener("pageSelected", this.imageClicked.bind(this));

            this.filmstrip = new Hilo.Detail.FilmstripPresenter(this.filmstripEl, images);
            this.filmstrip.addEventListener("imageInvoked", this.imageClicked.bind(this));

            this.imageNav.enableButtons();
        },

        imageClicked: function (args) {
            var self = this;
            args.detail.itemPromise.then(function (item) {
                self.gotoImage(args.detail.itemIndex, item.data.name);
            });
        },

        gotoImage: function (itemIndex, fileName) {

            this.flipview.showImageAt(itemIndex);

            this.imageNav.setNavigationOptions({
                itemIndex: itemIndex,
                itemName: fileName,
                query: this.query
            });
        }
    };

    // Detail Presenter Definition
    // ---------------------------

    WinJS.Namespace.define("Hilo.Detail", {
        DetailPresenter: WinJS.Class.mix(DetailPresenterConstructor, detailPresenterMembers, WinJS.Utilities.eventMixin)
    });
})();