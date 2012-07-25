describe('image loader', function () {

    var storage = Windows.Storage;
    var images;

    beforeEach(function (done) {

        var folderToSearch = Windows.Storage.ApplicationData.current.localFolder.path + "\\Indexed";
        var whenFolder = storage.StorageFolder.getFolderFromPathAsync(folderToSearch);

        whenFolder.then(function (folder) {
            var repo = new Hilo.ImageRepository(folder);

            repo.getImages(15)
                .then(function (result) { images = result; })
                .then(done);
        });
    });

    it('get 15 images', function () {
        expect(images.length).equal(15);
    });

});