﻿// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

// <SnippetHilojs_2001>
describe("Image Query Builder", function () {

    var queryBuilder, storageFolder;

    beforeEach(function (done) {
        queryBuilder = new Hilo.ImageQueryBuilder();

        var whenFolder = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("Indexed");
        whenFolder.then(function (folder) {
            storageFolder = folder;
            done();
        });
    });
    // </SnippetHilojs_2001>

    describe("when building a query", function () {
        var query;

        beforeEach(function () {
            query = queryBuilder.build(storageFolder);
        });

        it("should return a query object that can be executed", function () {
            expect(query.execute).to.be.a("function");
        });
    });


    describe("when serializing and then deserializing a query object", function () {
        var restoredQuery, originalQuery;

        beforeEach(function () {
            originalQuery = queryBuilder.build(Windows.Storage.KnownFolders.picturesLibrary);

            var jsonQuery = JSON.stringify(originalQuery);
            var parsedQuery = JSON.parse(jsonQuery);
            restoredQuery = Hilo.ImageQueryBuilder.deserialize(parsedQuery);
        });

        it("should restore all of the options for the query", function () {
            expect(restoredQuery.settings).deep.equals(originalQuery.settings);
        });
    });

    describe("when deserializing a query object for an unsupported folder", function () {
        var parsedQuery, deserializeFnWithParameter;

        beforeEach(function () {
            var query = queryBuilder.build(storageFolder);

            var jsonQuery = JSON.stringify(query);
            parsedQuery = JSON.parse(jsonQuery);

            deserializeFnWithParameter = Hilo.ImageQueryBuilder.deserialize.bind(null, parsedQuery);
        });

        it("should throw an error explaining that the folder is unknown", function () {
            expect(deserializeFnWithParameter).throw(Error, /unknown folder/);
        });
    });

    // <SnippetHilojs_2003>
    describe("when specifying a month and year for images", function () {
        var queryOptions;

        beforeEach(function () {
            var query = queryBuilder
                .forMonthAndYear(new Date(2012, 0))
                .build(storageFolder);

            queryOptions = new Windows.Storage.Search.QueryOptions();
            queryOptions.loadFromString(query._queryOptionsString);
        });

        it("should configure the query for the specified month and year", function () {
            expect(queryOptions.applicationSearchFilter).equals("System.ItemDate:2012-01-01T08:00:00Z..2012-02-01T07:59:59Z");
        });
    });
    // </SnippetHilojs_2003>

    // <SnippetHilojs_2002>
    describe("when executing a query that specifies the number of images to load", function () {
        var queryResult;

        beforeEach(function () {
            queryResult = queryBuilder
                .count(1)
                .build(storageFolder)
                .execute();
        });

        it("should load the specified number of images", function (done) {
            queryResult.then(function (images) {
                expect(images.length).equals(1);
                done();
            }).done(null, done);
        });
    });
    // </SnippetHilojs_2002>

    describe("when executing a query that does not specifies the number of images to load", function () {
        var queryResult;

        beforeEach(function () {
            queryResult = queryBuilder
                .build(storageFolder)
                .execute();
        });

        it("should load all images in the folder", function (done) {
            queryResult.then(function (images) {
                expect(images.length).equals(17);
                done();
            }).done(null, done);
        });
    });

    describe("when specifying the index of a specific image to load", function () {
        var queryResult;

        beforeEach(function () {
            queryResult = queryBuilder
                .imageAt(1)
                .build(storageFolder)
                .execute();
        });

        it("should only load that one image when executing", function (done) {
            queryResult.then(function (images) {
                expect(images.length).equals(1);
                done();
            }).done(null, done);
        });
    });

    describe("when specifying the images should be bindable", function () {
        var queryResult;

        beforeEach(function () {
            queryResult = queryBuilder
                .bindable(true)
                .build(storageFolder)
                .execute();
        });

        it("should return instances of bindable Picture objects", function (done) {
            queryResult.then(function (images) {
                var image = images[0];
                expect(image instanceof Hilo.Picture).true;
                done();
            }).done(null, done);
        });
    });

    describe("when building a query with an image index", function () {
        var queryResult;

        beforeEach(function () {
            queryResult = queryBuilder
                .imageAt(0)
                .build(storageFolder)
                .execute();
        });

        it("should load the one specified image", function (done) {
            queryResult.then(function (images) {
                expect(images.length).equals(1);
                done();
            }).done(null, done);
        });
    });

    describe("when executing an already built query and specifying an image index", function () {
        var queryResult;
        var imageIndex = 0;

        beforeEach(function () {
            queryResult = queryBuilder
                .build(storageFolder)
                .execute(imageIndex);
        });

        it("should load the one specified image", function (done) {
            queryResult.then(function (images) {
                expect(images.length).equals(1);
                done();
            }).done(null, done);
        });
    });
});
