(function () {

    // Imports And Constants
    // ---------------------

    var randomAccessStream = Windows.Storage.Streams.RandomAccessStream,
        creationCollisionOption = Windows.Storage.CreationCollisionOption,
        replaceExisting = creationCollisionOption.replaceExisting,
        readWrite = Windows.Storage.FileAccessMode.readWrite;

    // Private Methods
    // ---------------

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

    function writeThumbnailToFile(fileInfo, thumbnailFile) {
        var whenFileIsOpen = thumbnailFile.openAsync(readWrite);

        return whenFileIsOpen.then(function (output) {

            return fileInfo.getThumbnailAsync(Windows.Storage.FileProperties.ThumbnailMode.singleItem).then(function (thumbnail) {
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


    // Public API
    // ----------

    WinJS.Namespace.define("Tiles", {
        copyImages: copyImages
    });

})();