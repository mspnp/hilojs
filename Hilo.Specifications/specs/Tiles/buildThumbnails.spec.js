describe('live tile', function () {

    describe('when updating the tile', function () {

        var async = new AsyncSpec();

        async.beforeEach(function (complete) {
            Shared.getImages()
                .then(Tiles.buildThumbails)
                .then(async.storage.store('fileNames'))
                .then(complete);
        });

        async.it('should write the thumbnails to the tile thumbnails folder', function (storage) {
            storage['fileNames'].forEach(function (file) {

                var thumbnailExists = Shared.thumbnailFileExists(file);
                async.await(thumbnailExists).then(function (fileExists) {
                    expect(fileExists).toBe(true);
                });

            });
        });

    });

});