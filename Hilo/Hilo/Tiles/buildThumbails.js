(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var applicationData = Windows.Storage.ApplicationData,
        creationCollisionOption = Windows.Storage.CreationCollisionOption,
        replaceExisting = creationCollisionOption.replaceExisting,
        randomAccessStream = Windows.Storage.Streams.RandomAccessStream,
        readWrite = Windows.Storage.FileAccessMode.readWrite,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode.singleItem,
        thumbnailFolderName = 'tile-thumbnails';

    // Private Methods
    // ---------------

    function writeThumbnailToFile(fileInfo, thumbnailFile) {
        var whenFileIsOpen = thumbnailFile.openAsync(readWrite);

        return whenFileIsOpen.then(function (output) {

            return fileInfo.getThumbnailAsync(thumbnailMode).then(function (thumbnail) {
                var input = thumbnail.getInputStreamAt(0);
                return randomAccessStream.copyAsync(input, output).then(function () {
                    return output.flushAsync().then(function () {
                        input.close();
                        output.close();
                        return fileInfo.name;
                    });
                });
            });
        });
    }

    function copyImages(files, folder) {
        var fileBuilderPromises = files.map(function (fileInfo) {
            var writeThumbnail = writeThumbnailToFile.bind(this, fileInfo);
            var whenFileCreated = folder.createFileAsync(fileInfo.name, replaceExisting);
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
        var whenFolderCreated = localFolder.createFolderAsync(thumbnailFolderName, replaceExisting);
        return whenFolderCreated
            .then(copyThumbnailsToFolder)
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {
        buildThumbails: buildThumbnails
    });

})();