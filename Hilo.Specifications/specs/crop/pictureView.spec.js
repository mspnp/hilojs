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
        urlBuilder = {
            createObjectURL: function () {
                return "http://placekitten.com/300/200";
            }
        };

    });

    describe("when the picture loader promise completes", function () {
        beforeEach(function (done) {
            context = {
                drawImage: function () {
                    context.drawImage.wasCalled = true;

                    // complete the async beforeEach
                    done();
                }
            };

            imagePromise = WinJS.Promise.as([{}]);
            view = new Hilo.Crop.PictureView(context, imagePromise, urlBuilder);
        });

        it("should show the picture", function () {
            expect(context.drawImage.wasCalled).equals(true);
        });
    });

    describe("when asked to show the picture, before the picture has been loaded", function () {
        beforeEach(function () {
            context = {
                drawImage: function () {
                    context.drawImage.wasCalled = true;
                }
            };

            // create a promise that we will never resolve
            imagePromise = new WinJS.Promise(function (complete) { });

            view = new Hilo.Crop.PictureView(context, imagePromise, urlBuilder);
            view.drawImage();
        });

        it("should not show the picture", function () {
            expect(context.drawImage.wasCalled).equals(undefined);
        });
    });

});