(function () {

    // Imports And Constants
    // ---------------------

    var randomAccessStream = Windows.Storage.Streams.RandomAccessStream;
    var creationCollisionOption = Windows.Storage.CreationCollisionOption;
    var replaceExisting = creationCollisionOption.replaceExisting;
    var readWrite = Windows.Storage.FileAccessMode.readWrite;

    // Private Methods
    // ---------------

    var photocopier = {

        photoCopier: function (files, folder) {
            
            var fileBuilderPromises = files.map(function (fileInfo) {
                var writeThumbnail = photocopier.writeThumbnailToFile.bind(this, fileInfo);
                var whenFileCreated = folder.createFileAsync(fileInfo.name, replaceExisting);
                return whenFileCreated.then(writeThumbnail);
            });

            // Join all of the thumbnail file creation promises into 
            // a single promise that is returned from this method
            return WinJS.Promise.join(fileBuilderPromises);
        },

        writeThumbnailToFile: function (fileInfo, thumbnailFile) {
            var whenFileIsOpen = thumbnailFile.openAsync(readWrite);

            return whenFileIsOpen.then(function (output) {
                var input = fileInfo.thumbnail.getInputStreamAt(0);

                return randomAccessStream.copyAsync(input, output).then(function () {
                    return output.flushAsync().then(function () {
                        input.close();
                        output.close();
                        return fileInfo.name;
                    });
                });
            });
        }

    };

    // Public API
    // ----------

    WinJS.Namespace.define("Tiles", photocopier);

})();