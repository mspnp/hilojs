describe('live tile', function () {

    describe('when updating the tile', function () {

        var filesNames;

        beforeEach(function (done) {
            Shared.getImages()
                .then(Hilo.Tiles.buildThumbails)
                .then(function (result) {
                    filesNames = result;
                })
                .then(done);
        });

        it('should write the thumbnails to the tile thumbnails folder', function (done) {

            var all = filesNames.map(function (file) {
                return Shared.thumbnailFileExists(file).then(function (fileExists) {
                    expect(fileExists).equal(true);
                });
            });

            Shared.join(all).then(done);

        });

        // For official specifications on tile image sizes, see:
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh781198.aspx
        it('should create thumbnails equal to or less than 1024 x 1024', function (done) {

            var all = filesNames.map(function (file) {
                return Shared.getThumbnailSize(file).then(function (size) {
                    expect(size.height).lessThan(1025, 'height of ' + file);
                    expect(size.width).lessThan(1025, 'width of ' + file);
                });
            });

            Shared.join(all).then(done);
        });

    });

});