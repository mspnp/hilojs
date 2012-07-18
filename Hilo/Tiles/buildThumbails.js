(function () {
    'use strict';

    var applicationData = Windows.Storage.ApplicationData;
    var randomAccessStream = Windows.Storage.Streams.RandomAccessStream;
    var creationCollisionOption = Windows.Storage.CreationCollisionOption;
    var thumbnailFolderName = 'tile-thumbnails';

    WinJS.Namespace.define('Tiles', {

        buildThumbails: function (files) {

            return new WinJS.Promise(function (complete, error, progress) {

                applicationData.current.localFolder.createFolderAsync(thumbnailFolderName, creationCollisionOption.replaceExisting)
                    .then(function (folder) {

                        var localThumbnail = 'ms-appdata:///local/' + thumbnailFolderName + '/';

                        var promises = files.map(function (fileInfo) {
                            var createFile = folder.createFileAsync(fileInfo.name, creationCollisionOption.replaceExisting);
                            return createFile.then(function (newFile) {

                                return newFile.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
                                    var input = fileInfo.thumbnail.getInputStreamAt(0);

                                    return randomAccessStream.copyAsync(input, output).then(function () {
                                        return output.flushAsync().then(function () {
                                            input.close();
                                            output.close();
                                            return fileInfo.name;
                                        });
                                    });
                                });
                            });
                        });

                        WinJS.Promise.join(promises).then(function (files) {
                            var paths = files.map(function (file) {
                                return localThumbnail + file;
                            });
                            complete(paths);
                        });

                    });
            });
        }

    });

})();