// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("Detail page", function () {
    describe("detail page controller", function () {

        var detailPageController, filmstripController, flipviewController, imageNav;

        beforeEach(function () {
        	filmstripController = new Specs.WinControlStub();

            imageNav = {
                setImageIndex: function (index) {
                    imageNav.setImageIndex.wasCalled = true;
                    imageNav.setImageIndex.itemIndex = index;
                }
            }
            
            flipviewController = {
                showImageAt: function (index) {
                    flipviewController.showImageAt.wasCalled = true;
                    flipviewController.showImageAt.itemIndex = index;
                }
            };

            detailPageController = new Hilo.Detail.DetailPageController(flipviewController, filmstripController, imageNav);
            detailPageController.run();
        });

        describe("when an image has been activated", function () {
            beforeEach(function () {
                filmstripController.dispatchEvent("imageInvoked", { itemIndex: 1 });
            });

            it("should show the image", function () {
                expect(flipviewController.showImageAt.wasCalled).true;
                expect(flipviewController.showImageAt.itemIndex).equals(1);
            });

            it("should set the selected image for the image navigation controller", function () {
                expect(imageNav.setImageIndex.wasCalled).true;
                expect(imageNav.setImageIndex.itemIndex).equals(1);
            });
        });

    });
});