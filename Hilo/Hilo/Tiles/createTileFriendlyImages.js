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

    function writeThumbnailToFile(sourceFile, targetFile) {
        var whenFileIsOpen = targetFile.openAsync(fileAccessMode.readWrite);
        var whenThumbailIsReady = sourceFile.getThumbnailAsync(thumbnailMode.singleItem);
        var whenEverythingIsReady = WinJS.Promise.join([whenFileIsOpen, whenThumbailIsReady]);

        var inputStream, outputStream;

        whenEverythingIsReady.then(function (args) {
            // `args` contains the output from both `whenFileIsOpen` and `whenThumbailIsReady`.
            // We can identify them by the order they were in when we joined them.
            outputStream = args[0];
            var thumbnail = args[1];
            inputStream = thumbnail.getInputStreamAt(0);
            return randomAccessStream.copyAsync(inputStream, outputStream);

        }).then(function () {
            return outputStream.flushAsync();

        }).then(function () {
            inputStream.close();
            outputStream.close();
        });
    }

    function copyFilesToFolder(sourceFiles, targetFolder) {

        var allFilesCopied = sourceFiles.map(function (fileInfo) {
            // Create a new file in the target folder for each 
            // file in `sourceFiles`.
            var copyThumbnailToFile = writeThumbnailToFile.bind(this, fileInfo);
            var whenFileCreated = targetFolder.createFileAsync(fileInfo.name, creationCollisionOption.replaceExisting);

            return whenFileCreated.then(copyThumbnailToFile);
        });

        // Join all of the file copy promises into 
        // a single promise that is returned from this method
        return WinJS.Promise.join(allFilesCopied);
    };

    function returnFileNamesFor(files) {
        return files.map(function (fileInfo) {
            return fileInfo.name;
        });
    }

    function createTileFriendlyImages(files) {
        var localFolder = applicationData.current.localFolder;

        // Partially apply `copyFilesToFolder` to carry the files parameter with it,
        // allowing it to be used as a promise/callback that only needs to have
        // the `targetFolder` parameter supplied.
        var copyThumbnailsToFolder = copyFilesToFolder.bind(null, files);

        // Partially apply `returnFileNamesFor`, because it does not
        // use the output from the preceding promise.
        var returnFileNames = returnFileNamesFor.bind(null, files);

        // Promise to build the thumbnails and return the list of local file paths
        var whenFolderCreated = localFolder.createFolderAsync(thumbnailFolderName, creationCollisionOption.replaceExisting);

        return whenFolderCreated
            .then(copyThumbnailsToFolder)
            .then(returnFileNames);
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Tiles', {
        createTileFriendlyImages: createTileFriendlyImages
    });

})();