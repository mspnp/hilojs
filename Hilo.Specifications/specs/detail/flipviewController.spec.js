// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("detail page", function () {
    describe("flip view controller", function () {

        var flipviewController, el;

        beforeEach(function () {
        	el = new Specs.WinControlStub();

            flipviewController = new Hilo.Detail.FlipviewController(el);
        });

        describe("when an image has been selected", function () {
            var imageIndex = 3; 

            beforeEach(function () {
                flipviewController.showImageAt(imageIndex);
            });

            it("should show the image by its index", function () {
                expect(el.winControl.currentPage).equals(imageIndex);
            });
        });

    });
});