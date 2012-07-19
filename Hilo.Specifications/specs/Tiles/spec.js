﻿describe("live tile", function () {

    describe("when updating the tile", function () {
        var async = new AsyncSpec();

        var getImages = function () {
            var path = Windows.ApplicationModel.Package.current.installedLocation.path + "\\images";
            var whenFolder = Windows.Storage.StorageFolder.getFolderFromPathAsync(path);

            return whenFolder.then(function (folder) {
                return folder.getFilesAsync().then(function (files) {
                    return files;
                });
            });
        };

        var getFileNames = function (paths) {
            return paths.map(function (path) { return path.name });;
        };

        var processThumbnailFiles = function (fileNames) {
            var thumbnailFolderName = 'tile-thumbnails';
            var files = async.spec.files;

            var p = fileNames.map(function (fileName) {
                var fullPath = thumbnailFolderName + '\\' + fileName;
                return Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fullPath);
            });

            return WinJS.Promise.join(p);
        }

        async.beforeEach(function (complete) {
            getImages()
                .then(async.spec.store("files"))
                .then(Tiles.buildThumbails)
                .then(processThumbnailFiles)
                .then(async.spec.store("fileNames", getFileNames))
                .then(complete);
        });

        async.it("should use double quotes because single quotes are dumb", function (spec) {
            spec.files.forEach(function (file) {
                expect(spec.fileNames).toContain(file.name);
            });
        });

    });

});