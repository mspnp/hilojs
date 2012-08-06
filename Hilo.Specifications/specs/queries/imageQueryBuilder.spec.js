describe("image query builder", function () {

    var queryBuilder;

    beforeEach(function(done){
        var whenFolderIsReady = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("Indexed");

        whenFolderIsReady.then(function (folder) {
            queryBuilder = new Hilo.ImageQueryBuilder(folder);
            done();
        });
    });

    describe("when building a query", function () {
        var query;

        beforeEach(function(){
            query = queryBuilder.build();
        });

        it("should return a query object that can be executed", function () {
            expect(query.execute).to.be.a('function');
        });
    });

    describe("when executing a query that specifies the number of images to load", function () {
        var query;

        beforeEach(function () {
            query = queryBuilder.count(1).build();
        });

        it("should load the specified number of images", function (done) {
            query.execute().then(function (images) {
                expect(images.length).equals(1);
                done();
            });
        });
    });

});