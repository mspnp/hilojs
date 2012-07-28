(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var applicationData = Windows.Storage.ApplicationData,
        creationCollisionOption = Windows.Storage.CreationCollisionOption,
        randomAccessStream = Windows.Storage.Streams.RandomAccessStream,
        fileAccessMode = Windows.Storage.FileAccessMode,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode,
        thumbnailFolderName = 'tile-thumbnails';

    // Private Methods
    // ---------------

    function writeThumbnailToFile(fileInfo, thumbnailFile) {
        var whenFileIsOpen = thumbnailFile.openAsync(fileAccessMode.readWrite);
        var whenThumbailIsReady = fileInfo.getThumbnailAsync(thumbnailMode.singleItem);
        var whenEverythingIsReady = WinJS.Promise.join([whenFileIsOpen, whenThumbailIsReady]);

        var input, output;

        whenEverythingIsReady.then(function (args) {
            output = args[0];
            var thumbnail = args[1];
            input = thumbnail.getInputStreamAt(0);
            return randomAccessStream.copyAsync(input, output);
        }).then(function () {
            return output.flushAsync();
        }).then(function () {
            input.close();
            output.close();
        });

    }

    function copyImages(files, folder) {
        var fileBuilderPromises = files.map(function (fileInfo) {
            var writeThumbnail = writeThumbnailToFile.bind(this, fileInfo);
            var whenFileCreated = folder.createFileAsync(fileInfo.name, creationCollisionOption.replaceExisting);
            return whenFileCreated.then(writeThumbnail);
        });

        // Join all of the thumbnail file creation promises into 
        // a single promise that is returned from this method
        return WinJS.Promise.join(fileBuilderPromises);
    };

    function buildThumbnails(files) {
        var localFolder = applicationData.current.localFolder;

        // partially apply the photocopier to carry the files parameter with it,
        // allowing it to be used as a promise/callback that only needs to have
        // the `folder` parameter supplied.
        var copyThumbnailsToFolder = copyImages.bind(null, files);

        // Promise to build the thumbnails and return the list of local file paths
        var whenFolderCreated = localFolder.createFolderAsync(thumbnailFolderName, creationCollisionOption.replaceExisting);
        return whenFolderCreated
            .then(copyThumbnailsToFolder)
            .then(function () {
                return files.map(function (fileInfo) {
                    return fileInfo.name;
                });
            });
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {
        buildThumbails: buildThumbnails
    });

})();