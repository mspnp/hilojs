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

    // Rotate Presenter Constructor
    // ----------------------------

    function RotatePresenter(el, appBarPresenter, fileLoader, urlBuilder) {
        this.el = el;
        this.appBarPresenter = appBarPresenter;
        this.rotationDegrees = 0;
        this.urlBuilder = urlBuilder;

        this._bindToEvents();

        fileLoader.then(this._loadAndShowImage.bind(this));
    }

    // Rotate Presenter Members
    // ------------------------

    var rotatePresenterMembers = {
        // A rotation button was clicked on the app bar presenter.
        // Take the rotation degrees specified and add it to the current
        // image rotation. 
        rotateImage: function (args) {
            var rotateDegrees = args.detail.rotateDegrees;
            this._rotateImage(rotateDegrees);
        },

        // Save was clicked from the appbar presenter. 
        // Call out to the rotate image writer to pick a destination file and save it.
        saveImage: function () {
            var imageWriter = new Hilo.ImageWriter();
            var rotateImageWriter = new Hilo.Rotate.RotatedImageWriter(imageWriter);
            rotateImageWriter
                .rotate(this.imageFile, this.rotationDegrees)
		        .then(function () { WinJS.Navigation.back(); });
        },

        cancel: function () {
            WinJS.Navigation.back();
        },

        // Internal method.
        // Bind to the appbar presenter's events, to handle the button clicks
        _bindToEvents: function () {
            this.appBarPresenter.addEventListener("rotate", this.rotateImage.bind(this));
            this.appBarPresenter.addEventListener("save", this.saveImage.bind(this));
            this.appBarPresenter.addEventListener("cancel", this.cancel.bind(this));
        },

        // Internal method.
        // Take the query result from the image query and display the image that it loaded.
        _loadAndShowImage: function (queryResult) {
            var storageFile = queryResult[0].storageFile;
            this.imageFile = storageFile;

            var url = this.urlBuilder.createObjectURL(storageFile);
            this.el.src = url;
        },

        // Internal method
        // Sets the CSS rotation of the image element. A CSS transition has also
        // been defined in the CSS file so that the image will turn instead of just 
        // appearing in the new orientation, suddenly.
        _rotateImage: function (rotateDegrees) {
            if (rotateDegrees) {
                this.rotationDegrees += rotateDegrees;
            }

            // build a [CSS transform][1] to rotate the image by the specified
            // number of degrees, and apply it to the image
            //
            // [1]: http://msdn.microsoft.com/en-us/library/windows/apps/ff974936.aspx

            var rotation = "rotate(" + this.rotationDegrees + "deg)";
            this.el.style.transform = rotation;
        }
    };

    // Rotate Presenter Definition
    // ---------------------------

    WinJS.Namespace.define("Hilo.Rotate", {
        RotatePresenter: WinJS.Class.mix(RotatePresenter, rotatePresenterMembers, WinJS.Utilities.eventMixin)
    });

})();
