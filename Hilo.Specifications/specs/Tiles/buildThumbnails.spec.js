describe('live tile', function () {

    describe('when updating the tile', function () {
        var thumbnailFolderName = 'tile-thumbnails';

        var async = new AsyncSpec();

        var fileExist = function (fileName) {
            var fullPath = thumbnailFolderName + '\\' + fileName;
            var fileOpen = Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fullPath);

            var promise = new WinJS.Promise(function(complete){
                fileOpen.done(function () {
                    complete(true);
                }, function () {
                    complete(false);
                });;
            });

            return promise;
        }

        async.beforeEach(function (complete) {
            Shared.getImages()
                .then(Tiles.buildThumbails)
                .then(async.storage.store('fileNames'))
                .then(complete);
        });

        async.it('should write the thumbnails to the tile thumbnails folder', function (storage) {
            storage.fileNames.forEach(function (file) {

                async.await(fileExist(file)).then(function (fileExists) {
                    expect(fileExists).toBe(true);
                });

            });
        });

    });

});