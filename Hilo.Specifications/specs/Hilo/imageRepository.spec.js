describe('image loader', function () {

    var async = new AsyncSpec();
    var storage = Windows.Storage;

    async.beforeEach(function (complete) {

        var folderToSearch = Windows.Storage.ApplicationData.current.localFolder.path + "\\Indexed";
        var whenFolder = storage.StorageFolder.getFolderFromPathAsync(folderToSearch);

        whenFolder.then(function (folder) {
            var repo = new Hilo.ImageRepository(folder);
            return repo.getImages(15)
                .then(async.storage.store('images'))
                .then(complete);
        });
    });

    async.it('get 15 images', function (storage) {
        expect(storage.images.length).toBe(15);
    });

});