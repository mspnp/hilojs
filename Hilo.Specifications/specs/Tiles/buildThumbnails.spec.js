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

        // For official specifications on tile image sizes, see:
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh781198.aspx
        async.it('should create thumbnails equal to or less than 1024 x 1024', function (storage) {
            storage['fileNames'].forEach(function (file) {

                var thumbnailExists = Shared.getThumbnailSize(file);
                async.await(thumbnailExists).then(function (size) {
                    expect(size.height).toBeLessThan(1025, 'height of ' + file);
                    expect(size.width).toBeLessThan(1025, 'width of ' + file);
                });

            });
        });

    });

});