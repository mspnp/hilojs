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

    function CropPresenterConstructor(image, imageView, cropSelection, imageWriter, appBarPresenter) {
        this.image = image;
        this.imageView = imageView;
        this.imageWriter = imageWriter;
        this.cropSelection = cropSelection;
        this.appBarPresenter = appBarPresenter;
        //this.navigation = navigation || WinJS.Navigation;

        //this.imageWriter.addEventListener("errorOpeningSourceFile", function (error) {
        //    WinJS.Navigation.navigate("/Hilo/hub/hub.html");
        //});

        // If the file retrieved by index does not match the name associated
        // with the query, we assume that it has been deleted (or modified)
        // and we send the user back to the hub screen.
        //if (!storageFile || storageFile.name !== self.expectedFileName) {
        //    return self.navigation.navigate("/Hilo/hub/hub.html");
        //}
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
            var cropRect = this.cropSelection.getCoords();
            var selectionRectScaledToImage = this.scaleCanvasRectToImage(this.imageToScreenScale, cropRect, this.offset);

            this.imageWriter
                .crop(this.storageFile, selectionRectScaledToImage)
                .then(function (success) {
                    if (success) {
                        self.navigation.back();
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
