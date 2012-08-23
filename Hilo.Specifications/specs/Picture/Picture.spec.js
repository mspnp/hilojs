// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

//TODO: re-write these specs to run in Mocha, instead of Jasmine
describe("The view model for a picture", function () {
    "use strict";

    var viewmodel;
    var file;

    beforeEach(function () {

        var retrieveProperties = WinJS.Promise.as({ lookup: function () { } });
        var imageBlob = new Blob();

        file = {
            name: "my-image",
            addEventListener: function () { },
            getThumbnailAsync: function () { return WinJS.Promise.as(imageBlob); },
            properties: {
                retrievePropertiesAsync: function () { return retrieveProperties; }
            }
        };

        viewmodel = new Hilo.Picture(file);
    });

    describe("when the underlying thumbnail is present", function () {

        it("should have the same name as the underlying file", function () {
            expect(viewmodel.name).equal(file.name);
        });

        it("should have a url pointing to a blob url", function () {
            expect(viewmodel.url).match(/url\(blob:[\dA-F]{8}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{12}\)/);
        });

    });

    describe("when the underlying thumbnail is not present", function () {

        beforeEach(function () {
            file.thumbnail = null;
            file.getThumbnailAsync = function () { return WinJS.Promise.as(null); };

            viewmodel = new Hilo.Picture(file);
        });

        it("should set the thumbnail url to an empty string", function () {
            expect(viewmodel.url).equal("");
        });
    });

    describe("when using the convenience method for contructing a view model", function () {
        beforeEach(function () {
            viewmodel = Hilo.Picture.from(file);
        });

        it("should have the same name as the underlying file", function () {
            expect(viewmodel.name).equal(file.name);
        });

        it("should have a url pointing to a blob url", function () {
            expect(viewmodel.url).match(/url\(blob:[\dA-F]{8}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{12}\)/);
        });
    });

});