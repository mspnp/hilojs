// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

xdescribe("Crop Page Presenter", function () {

    var cropPresenter,
        canvasEl,
        cropSelectionEl,
        menuEl,
        fileLoader,
        cropImageWriter,
        picture,
        navigation;

    beforeEach(function () {
        canvasEl = document.createElement("canvas");
        // set an arbitray width and height
        canvasEl.width = 800;
        canvasEl.height = 600;

        cropSelectionEl = new Specs.WinControlStub();
        cropSelectionEl.style = {};
        cropSelectionEl.querySelector = function (selector) { return document.createElement("div"); };

        menuEl = new Specs.WinControlStub();

        picture = { storageFile: { name: "some.jpg" } };
        picture.storageFile = new Blob();
        picture.storageFile.name = "some.jpg";

        fileLoader = new WinJS.Promise(function (done) {
            done([picture]);
        });

        navigation = {
            back: function () {
                navigation.back.wasCalled = true;
            },
            navigate: function () {
                navigation.navigate.wasCalled = true;
                navigation.navigate.url = arguments[0];
            }
        };

        cropImageWriter = {};

    });

    describe("when the file name matches the expectation", function () {

        beforeEach(function (done) {
            cropPresenter = new Hilo.Crop.CropPresenter(fileLoader, canvasEl, cropSelectionEl, menuEl, cropImageWriter, "some.jpg", navigation);
            cropPresenter.start().then(function () { done(); });
        });

        it("should not navigate anywhere", function () {
            expect(navigation.navigate.wasCalled).not.equal(true);
        });
    });

    describe("when the file name does not match the expectation", function () {

        beforeEach(function (done) {
            cropPresenter = new Hilo.Crop.CropPresenter(fileLoader, canvasEl, cropSelectionEl, menuEl, cropImageWriter, "different.jpg", navigation);
            cropPresenter.start().then(function () { done(); });
        });

        it("should navigate back to the hub page", function () {
            expect(navigation.navigate.url).equal("/Hilo/hub/hub.html");
            expect(navigation.navigate.wasCalled).equal(true);

        });
    });


});