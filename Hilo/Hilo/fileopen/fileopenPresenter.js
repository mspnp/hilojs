// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // This function is stateless so it is not include as a member
    function findImageByIndex(images, expectedIndex, expectedName) {
        var imageToCheck = images[expectedIndex];
        var result = {};
        var i, l;

        if (imageToCheck && imageToCheck.name === expectedName) {
            result.actualIndex = expectedIndex;
        } else {
            l = images.length;
            for (i = 0; i < l; i++) {
                imageToCheck = images[i];
                if (imageToCheck.name === expectedName) {
                    result.actualIndex = i;
                    break;
                }
            }
        }

        return result;
    }

    // Detail Presenter Definition
    // ---------------------------
    var FileOpenPresenter = WinJS.Class.define(
        function FileOpenPresenterConstructor(filmstripPresenter, flipviewPresenter, hiloAppBar, navigation) {
            this.flipview = flipviewPresenter;
            this.filmstrip = filmstripPresenter;
            this.hiloAppBar = hiloAppBar;
            this.navigation = navigation;

            Hilo.bindFunctionsTo(this, [
                "bindImages"
            ]);
        },

        {
            start: function (options) {
                var self = this;
                this.query = options.query;

                return this.query.getFilesAsync()
                    .then(function(files) {
                        return self._createViewModels(files);
                    })
                    .then(function (images) {
                        var splash = document.querySelector("#extendedSplash");
                        WinJS.UI.Animation.fadeOut(splash).done(function () {
                            splash.style.display = "none";
                        });
                        var result = findImageByIndex(images, options.itemIndex, options.itemName);
                        var storageFile = images[options.itemIndex];
                        options.picture = storageFile;
                        // If the file retrieved by index does not match the name associated
                        // with the query, we assume that it has been deleted (or modified)
                        // and we send the user back to the last screen.
                        if (isNaN(result.actualIndex)) {
                            self.navigation.back();
                        } else {
                            self.bindImages(images);
                            self.gotoImage(result.actualIndex, options.picture);
                        }
                    });

            },

            bindImages: function (images) {

                this.flipview.bindImages(images);
                this.flipview.addEventListener("pageSelected", this.imageClicked.bind(this));

                this.filmstrip.bindImages(images);
                this.filmstrip.addEventListener("imageInvoked", this.imageClicked.bind(this));

                this.hiloAppBar.enableButtons();
            },

            imageClicked: function (args) {
                var self = this,
                    itemIndex = args.detail.itemIndex;

                args.detail.itemPromise.then(function (item) {
                    self.gotoImage(itemIndex, item.data);
                    if (item.data.isCorrupt || item.data.isOffline) {
                        self.hiloAppBar.disableButtons();
                    } else {
                        self.hiloAppBar.enableButtons();
                    }
                });

                this.dispatchEvent("pageSelected", {
                    itemIndex: itemIndex
                });
            },

            gotoImage: function (itemIndex, picture) {

                var state = this.navigation.history.current.state;
                state.itemIndex = itemIndex;
                state.itemName = picture.name;
                state.picture = picture;

                this.flipview.showImageAt(itemIndex);
                this.filmstrip.selectImageAt(itemIndex);

                this.hiloAppBar.setNavigationOptions({
                    itemIndex: itemIndex,
                    itemName: picture.name,
                    query: this.query,
                    picture: picture
                });
            },

            // Internal method. Wraps the original `StorageFile` objects in 
            // `Hilo.Picture` objects, so that they can be bound to UI controls
            // such as the `WinJS.UI.ListView`.
            _createViewModels: function (files) {

                var count = files.length;
                var results = new Array(count);
                var index = count - 1;
                var proceed = true;

                function onCancellation() {
                    proceed = false;
                }

                return new WinJS.Promise(function (complete, error) {

                    function processNextFile() {
                        var file = files[index];
                        results[index] = new Hilo.Picture(file);
                        index--;

                        if (index < 0) {
                            complete(results);
                        } else if (!proceed) {
                            error("Cancel");
                        } else {
                            setImmediate(processNextFile);
                        }
                    }

                    processNextFile();

                }, onCancellation);
            }
        });

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.FileOpen", {
        FileOpenPresenter: WinJS.Class.mix(FileOpenPresenter, WinJS.Utilities.eventMixin)
    });
})();
