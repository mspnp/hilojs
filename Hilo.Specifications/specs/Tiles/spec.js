describe("live tile", function () {

    describe("when updating the tile", function(){
        var getFiles = function () {
            var path = Windows.ApplicationModel.Package.current.installedLocation.path + "\\images";
            var whenFolder = Windows.Storage.StorageFolder.getFolderFromPathAsync(path);

            return whenFolder.then(function (folder) {
                return folder.getFilesAsync().then(function (files) {
                    return files;
                });
            });
        };

        it("should use double quotes because single quotes are dumb", function () {
            runs(function () {

                getFiles()
                    .then(Tiles.buildThumbails)
                    .then(function (paths) {
                        debugger;
                    });

            });
        });

    });

});