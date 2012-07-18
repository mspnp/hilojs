(function () {

    // Imports And Constants
    // ---------------------

    var randomAccessStream = Windows.Storage.Streams.RandomAccessStream;
    var creationCollisionOption = Windows.Storage.CreationCollisionOption;
    var replaceExisting = creationCollisionOption.replaceExisting;

    // Private Methods
    // ---------------

    function copyThumbnailsToFolder(files, folder) {
        var fileBuilderPromises = files.map(function (fileInfo) {
            var createFile = folder.createFileAsync(fileInfo.name, replaceExisting);
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

        return WinJS.Promise.join(fileBuilderPromises);
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Tiles", {
        photoCopier: copyThumbnailsToFolder
    });

})();