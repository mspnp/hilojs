// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  that code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Constructor Function
    // --------------------

    function CropPresenterConstructor(image, imageView, imageWriter, appBarPresenter) {
        this.image = image;
        this.imageView = imageView;
        this.imageWriter = imageWriter;
        this.appBarPresenter = appBarPresenter;
    }

    // Methods
    // -------

    var cropPresenterMembers = {

        // register event listeners for all of the app bar buttons
        start: function () {
            this.appBarPresenter.addEventListener("cancel", this.cancel.bind(this));
            this.appBarPresenter.addEventListener("save", this.saveImageAs.bind(this));
            this.appBarPresenter.addEventListener("unsnap", this.unSnapView.bind(this));
        },

        unSnapView: function () {
            Windows.UI.ViewManagement.ApplicationView.tryUnsnap();
        },

        saveImageAs: function () {
            var self = this;
            var storageFile = this.image.getStorageFile();
            var selectionRectScaledToImage = this.imageView.getScaledSelectionRectangle();

            this.imageWriter.addEventListener("errorOpeningSourceFile", function (error) {
                WinJS.Navigation.navigate("/Hilo/hub/hub.html");
            });

            this.imageWriter
                .crop(storageFile, selectionRectScaledToImage)
                .then(function (success) {
                    if (success) {
                        self.dispatchEvent("imageSaved", {});
                    }
                });
        },

        cancel: function () {
            WinJS.Navigation.back();
        }
    };

    // Crop Presenter Definition
    // --------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CropPresenter: WinJS.Class.mix(CropPresenterConstructor, cropPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();
