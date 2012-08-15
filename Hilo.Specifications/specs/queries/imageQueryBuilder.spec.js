describe("image query builder", function () {

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
        	query = queryBuilder.forMonthAndYear("Jan 2012").build(storageFolder);
        });

        it("should configure the query for the specified month and year", function () {
            expect(query.queryOptions.applicationSearchFilter).equals("System.ItemDate: Jan 2012");
        });
    });

    describe("when executing a query that specifies the number of images to load", function () {
        var query;

        beforeEach(function () {
            query = queryBuilder.count(1).build(storageFolder);
        });

        it("should load the specified number of images", function (done) {
            query.execute().then(function (images) {
                expect(images.length).equals(1);
                done();
            });
        });
    });

    describe("when executing a query that does not specifies the number of images to load", function () {
        var query;

        beforeEach(function () {
            query = queryBuilder.build(storageFolder);
        });

        it("should load all images in the folder", function (done) {
            query.execute().then(function (images) {
                expect(images.length).equals(17);
                done();
            });
        });
    });

    describe("when specifying the index of a specific image to load", function () {
        var query;

        beforeEach(function () {
            query = queryBuilder.imageAt(1).build(storageFolder);
        });

        it("should only load that one image when executing", function (done) {
            query.execute().then(function (images) {
                expect(images.length).equals(1);
                done();
            });
        });
    });

    describe("when specifying the images should be bindable", function () {
        var query;

        beforeEach(function () {
            query = queryBuilder.bindable().build(storageFolder);
        });

        it("should return instances of bindable Picture objects", function () {
            query.execute().then(function (images) {
                expect(images[0]).to.be.a("Picture");
            });
        });
    });
});