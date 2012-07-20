(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var thumbnailFolderName = 'tile-thumbnails';

    // Private Methods
    // ---------------

    var getImages = function () {
        var path = Windows.ApplicationModel.Package.current.installedLocation.path + '\\images';
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

    var thumbnailFileExists = function (fileName) {
        var fullPath = thumbnailFolderName + '\\' + fileName;
        var fileOpen = Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fullPath);

        var promise = new WinJS.Promise(function (complete) {
            fileOpen.done(function () {
                complete(true);
            }, function () {
                complete(false);
            });;
        });

        return promise;
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Shared", {
        getImages: getImages,
        getFileNames: getFileNames,
        thumbnailFileExists: thumbnailFileExists
    });
})();