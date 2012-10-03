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

    // Flipview Presenter Constructor
    // ------------------------------

    function FlipviewPresenterConstructor(el, images) {
        this.el = el;
        this.winControl = el.winControl;
        this.bindImages(images);
        this.el.addEventListener("pageselected", this.pageSelected.bind(this));
    }

    // Flipview Presenter Members
    // --------------------------

    var flipviewPresenterMembers = {
        // <SnippetHilojs_1606>
        bindImages: function (images) {
            this.bindingList = new WinJS.Binding.List(images);
            this.winControl.itemDataSource = this.bindingList.dataSource;
        },
        // </SnippetHilojs_1606>

        pageSelected: function (args) {
            var itemIndex = this.winControl.currentPage;
            var item = this.bindingList.getAt(itemIndex);

            this.dispatchEvent("pageSelected", {
                itemIndex: itemIndex,
                itemPromise: WinJS.Promise.as({ data: item })
            });
        },

        showImageAt: function (index) {
            this.winControl.currentPage = index;
        }
    }

    // Flipview Presenter Definition
    // -----------------------------

    WinJS.Namespace.define("Hilo.Detail", {
        FlipviewPresenter: WinJS.Class.mix(FlipviewPresenterConstructor, flipviewPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();