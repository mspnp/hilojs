// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("Rotate Page Presenter", function () {

    var rotatePresenter,
        el,
        appBarPresenter,
        imageLoaderPromise,
        picture,
        navigation,
        imageFiles;

    before(function (done) {
        // Note that this is a `before` block and not a `beforeEach`.
        // This is because we only need to copy the thumbnails once
        // for the entire set of assertions.
        // If we were to copy the files in a `beforeEach`, the tests
        // would run slower and we would risk creation collisions.
        Shared.getImages()
            .then(function (images) {
                imageFiles = images;
            })
            .then(done);
    });

    beforeEach(function () {
        el = new Specs.WinControlStub();
        el.style = {};

        picture = new Hilo.Picture(imageFiles[0]);

        imageLoaderPromise = new WinJS.Promise(function (done) {
            done([picture]);
        });

        appBarPresenter = new Specs.EventStub();

        navigation = {
            back: function () {
                navigation.back.wasCalled = true;
            },
            navigate: function () {
                navigation.navigate.wasCalled = true;
                navigation.navigate.url = arguments[0];
            }
        };

        rotatePresenter = new Hilo.Rotate.RotatePresenter(el, appBarPresenter, imageLoaderPromise, navigation);
    });

    describe("when the file name matches the expectation", function () {

        beforeEach(function (done) {
            rotatePresenter = new Hilo.Rotate.RotatePresenter(el, appBarPresenter, imageLoaderPromise, "some.jpg", navigation);
            rotatePresenter.start().then(function () { done(); });
        });

        describe("when rotating an image", function () {

            beforeEach(function () {
                appBarPresenter.dispatchEvent("rotate", {
                    rotateDegrees: 90
                });
            });

            it("should add the specified degrees to the image rotation", function () {
                expect(el.style.transform).equals("rotate(90deg)");
            });
        });
    });

    describe("when the file name does not match the expectation", function () {

        beforeEach(function (done) {
            rotatePresenter = new Hilo.Rotate.RotatePresenter(el, appBarPresenter, imageLoaderPromise, "different.jpg", navigation);
            rotatePresenter.start().then(function () { done(); });
        });

        it("should navigate back to the hub page", function () {
            expect(navigation.navigate.url).equal("/Hilo/hub/hub.html");
            expect(navigation.navigate.wasCalled).equal(true);

        });
    });


});