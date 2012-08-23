// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("picture view", function () {

    var urlBuilder, imagePromise, context, view;

    beforeEach(function () {
        context = {
            drawImage: function () {
                debugger;
                context.drawImage.wasCalled = true;
            }
        };

        urlBuilder = {
            createObjectURL: function () {
                return "blob:(a url)";
            }
        };

        imagePromise = WinJS.Promise.as([{}]);

        view = new Hilo.Crop.PictureView(context, imagePromise, urlBuilder);
    });

    describe("when the picture loader promise completes", function () {
        it("should show the picture", function () {
            expect(context.drawImage.wasCalled).equals(true);
        });
    });

    describe("when asked to show the picture, before the picture has been loaded", function () {
        it("should not show the picture");
    });

    describe("when asked to show the picture, after the picture has been loaded", function () {
        it("should show the picture");
    });

});