// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var applicationData = Windows.Storage.ApplicationData,
        creationCollisionOption = Windows.Storage.CreationCollisionOption,
        randomAccessStream = Windows.Storage.Streams.RandomAccessStream,
        fileAccessMode = Windows.Storage.FileAccessMode,
        thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode,
        thumbnailFolderName = "tile-thumbnails";

    // Private Methods
    // ---------------

    // <SnippetHilojs_1005>
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
    // </SnippetHilojs_1005>

    function copyFilesToFolder(sourceFiles, targetFolder) {

        var allFilesCopied = sourceFiles.map(function (fileInfo, index) {
            // Create a new file in the target folder for each 
            // file in `sourceFiles`.
            var thumbnailFileName = index + ".jpg";
            var copyThumbnailToFile = writeThumbnailToFile.bind(this, fileInfo);
            var whenFileCreated = targetFolder.createFileAsync(thumbnailFileName, creationCollisionOption.replaceExisting);

            return whenFileCreated
                .then(copyThumbnailToFile)
                .then(function () { return thumbnailFileName; });
        });

        // We now want to wait until all of the files are finished 
        // copying. We can "join" the file copy promises into 
        // a single promise that is returned from this method.
        return WinJS.Promise.join(allFilesCopied);
    };

    // <SnippetHilojs_1004>
    function createTileFriendlyImages(files) {
        var localFolder = applicationData.current.localFolder;

        // We utilize the concept of [Partial Application][1], specifically
        // using the [`bind`][2] method available on functions in JavaScript.
        // `bind` allows us to take an existing function and to create a new 
        // one with arguments that been already been supplied (or rather
        // "applied") ahead of time.
        //
        // [1]: http://en.wikipedia.org/wiki/Partial_application 
        // [2]: http://msdn.microsoft.com/en-us/library/windows/apps/ff841995

        // Partially apply `copyFilesToFolder` to carry the files parameter with it,
        // allowing it to be used as a promise/callback that only needs to have
        // the `targetFolder` parameter supplied.
        var copyThumbnailsToFolder = copyFilesToFolder.bind(null, files);

        // Promise to build the thumbnails and return the list of local file paths.
        var whenFolderCreated = localFolder.createFolderAsync(thumbnailFolderName, creationCollisionOption.replaceExisting);

        return whenFolderCreated
            .then(copyThumbnailsToFolder);
    }
    // </SnippetHilojs_1004>

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Tiles", {
        createTileFriendlyImages: createTileFriendlyImages
    });

})();