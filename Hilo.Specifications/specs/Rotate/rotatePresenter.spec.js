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
        menuPresenter,
        imageLoaderPromise,
        picture,
        urlBuilder,
        navigation;

    beforeEach(function () {
        el = new Specs.WinControlStub();
        el.style = {};

        picture = { storageFile: { name: "some.jpg" } };

        urlBuilder = {
            createObjectURL: function () {
                return "a url";
            }
        };

        imageLoaderPromise = new WinJS.Promise(function (done) {
            done([picture]);
        });

        menuPresenter = new Specs.EventStub();

        navigation = {
            back: function () {
                navigation.back.wasCalled = true;
            },
            navigate: function () {
                navigation.navigate.wasCalled = true;
                navigation.navigate.url = arguments[0];
            }
        };

        rotatePresenter = new Hilo.Rotate.RotatePresenter(el, menuPresenter, imageLoaderPromise, urlBuilder, navigation);
    });

    describe("when the file name matches the expectation", function () {

        beforeEach(function (done) {
            rotatePresenter = new Hilo.Rotate.RotatePresenter(el, menuPresenter, imageLoaderPromise, urlBuilder, "some.jpg", navigation);
            rotatePresenter.start().then(function () { done(); });
        });

        describe("when rotating an image", function () {

            beforeEach(function () {
                menuPresenter.dispatchEvent("rotate", {
                    rotateDegrees: 90
                });
            });

            it("should add the specified degrees to the image rotation", function () {
                expect(el.style.transform).equals("rotate(90deg)");
            });

            it("should not navigate anywhere", function () {
                expect(navigation.navigate.wasCalled).not.equal(true);
            });
        });
    });

    describe("when the file name does not match the expectation", function () {

        beforeEach(function (done) {
            rotatePresenter = new Hilo.Rotate.RotatePresenter(el, menuPresenter, imageLoaderPromise, urlBuilder, "different.jpg", navigation);
            rotatePresenter.start().then(function () { done(); });
        });

        it("should navigate back to the hub page", function () {
            expect(navigation.navigate.url).equal("/Hilo/hub/hub.html");
            expect(navigation.navigate.wasCalled).equal(true);

        });
    });


});