// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("image query builder", function () {

    var queryBuilder, storageFolder;

    beforeEach(function (done) {
    	queryBuilder = new Hilo.ImageQueryBuilder();

    	var whenFolder = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("Indexed");
    	whenFolder.then(function (folder) {
    		storageFolder = folder;
            done();
        });
    });

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
        var deserializedQuery, serializedQuery;

        beforeEach(function () {
        	var query = queryBuilder.build(storageFolder);

            serializedQuery = query.serialize();
            deserializedQuery = Hilo.ImageQueryBuilder.deserialize(serializedQuery);
        });

        it("should restore all of the options for the query", function () {
            expect(deserializedQuery.settings).deep.equals(serializedQuery);
        });
    });

    describe("when specifying a month and year for images", function () {
        var query;

        beforeEach(function () {
        	query = queryBuilder
				.forMonthAndYear("Jan 2012")
				.build(storageFolder);
        });

        it("should configure the query for the specified month and year", function () {
        	expect(query.queryOptions.applicationSearchFilter).equals("System.ItemDate: Jan 2012");
        });
    });

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
				.bindable()
				.build(storageFolder)
				.execute();
        });

    	it("should return instances of bindable Picture objects", function (done) {
    		queryResult.then(function (images) {
    			var image = images[0];
    			expect(image instanceof Hilo.Picture).equals(true);
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