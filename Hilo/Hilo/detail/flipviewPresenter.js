// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Flipview Presenter Definition
    // -----------------------------
    var FlipviewPresenter = WinJS.Class.define(

        // <SnippetHilojs_1208>
        function FlipviewPresenterConstructor(el) {
            this.el = el;
            this.winControl = el.winControl;
            this.el.addEventListener("pageselected", this.pageSelected.bind(this));
        },
        // </SnippetHilojs_1208>
        {
            // <SnippetHilojs_1606>
            // <SnippetHilojs_1209>
            bindImages: function (images) {
                this.bindingList = new WinJS.Binding.List(images);
                this.winControl.itemDataSource = this.bindingList.dataSource;
            },
            // </SnippetHilojs_1209>
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
        });

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        FlipviewPresenter: WinJS.Class.mix(FlipviewPresenter, WinJS.Utilities.eventMixin)
    });

})();
