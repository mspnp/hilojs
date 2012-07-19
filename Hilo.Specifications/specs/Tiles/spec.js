describe("live tile", function () {

    describe("when updating the tile", function () {
        var getFiles = function () {
            var path = Windows.ApplicationModel.Package.current.installedLocation.path + "\\images";
            var whenFolder = Windows.Storage.StorageFolder.getFolderFromPathAsync(path);

            return whenFolder.then(function (folder) {
                return folder.getFilesAsync().then(function (files) {
                    return files;
                });
            });
        };

        beforeEach(function () {
            var that = this;
            this.done = false;

            getFiles()
               .then(Tiles.buildThumbails)
               .then(function (paths) {
                   var thumbnailFolderName = 'tile-thumbnails';

                   var p = paths.map(function (path) {
                       var fullPath = thumbnailFolderName + '\\' + path;
                       return Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fullPath);
                   });

                   WinJS.Promise.join(p).then(function (files) {
                       that.files = files;
                       that.paths = paths;
                       that.done = true;
                   });
               });
        });

        it("should use double quotes because single quotes are dumb", function () {

            waitsFor(function () {
                return this.done;
            });

            runs(function () {
                var paths = this.paths;
                this.files.forEach(function (file) {
                    expect(paths).toContain(file.name);
                });
            });
        });

    });

});