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

    function RotatePresenter(el, appBarPresenter, fileLoader, expectedFileName, navigation) {
        this.el = el;
        this.appBarPresenter = appBarPresenter;
        this.fileLoader = fileLoader;
        this.expectedFileName = expectedFileName;
        this.navigation = navigation || WinJS.Navigation;

        this.rotationDegrees = 0;

        this.rotateImage = this.rotateImage.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.cancel = this.cancel.bind(this);
        this.unsnap = this.unsnap.bind(this);
    }

    // Rotate Presenter Members
    // ------------------------

    var rotatePresenterMembers = {

        start: function () {
            this._bindToEvents();
            return this.fileLoader.then(this._loadAndShowImage.bind(this));
        },

        dispose: function () {
            this._unbindEvents();

            this.hiloPicture.dispose();
            delete this.hiloPicture;

            delete this.el;
            delete this.appBarPresenter;
            delete this.fileLoader;
            delete this.expectedFileName;
            delete this.navigation;
        },

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
            var self = this;
            var imageWriter = new Hilo.ImageWriter();
            var rotateImageWriter = new Hilo.Rotate.RotatedImageWriter(imageWriter);

            rotateImageWriter
                .rotate(this.hiloPicture.storageFile, this.rotationDegrees)
		        .then(function (success) {
		            if (success) {
		                self.navigation.back();
		            }
		        });
        },

        cancel: function () {
            this.navigation.back();
        },

        unsnap: function () {
            Windows.UI.ViewManagement.ApplicationView.tryUnsnap();
        },

        // Internal method.
        // Bind to the appbar presenter's events, to handle the button clicks
        _bindToEvents: function () {
            this.appBarPresenter.addEventListener("rotate", this.rotateImage);
            this.appBarPresenter.addEventListener("save", this.saveImage);
            this.appBarPresenter.addEventListener("cancel", this.cancel);
            this.appBarPresenter.addEventListener("unsnap", this.unsnap);
        },

        _unbindEvents: function () {
            this.appBarPresenter.removeEventListener("rotate", this.rotateImage);
            this.appBarPresenter.removeEventListener("save", this.saveImage);
            this.appBarPresenter.removeEventListener("cancel", this.cancel);
            this.appBarPresenter.removeEventListener("unsnap", this.unsnap);
        },

        // Internal method.
        // Take the query result from the image query and display the image that it loaded.
        // <SnippetHilojs_1611>
        _loadAndShowImage: function (queryResult) {
            var that = this;
            var storageFile = queryResult[0].storageFile;

            if (storageFile.name != this.expectedFileName) {
                this.navigation.navigate("/Hilo/hub/hub.html");
            } else {
                this.hiloPicture = new Hilo.Picture(storageFile);
                this.el.src = this.hiloPicture.src.url;
            }
        },
        // </SnippetHilojs_1611>

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
