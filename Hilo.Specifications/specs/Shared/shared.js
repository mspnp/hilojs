(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var appImagesPath = Windows.ApplicationModel.Package.current.installedLocation.path + '\\images',
        localFolder = Windows.Storage.ApplicationData.current.localFolder,
        replaceExisting = Windows.Storage.CreationCollisionOption.replaceExisting,
        replaceExistingFile = Windows.Storage.NameCollisionOption.replaceExisting,
        indexedFolderName = 'Indexed',
        thumbnailFolderName = 'tile-thumbnails';

    // Private Methods
    // ---------------

    function copyImagesFromAppPath(indexedFolder) {

        return Windows.Storage.StorageFolder.getFolderFromPathAsync(appImagesPath).then(function (appImagesFolder) {
           return appImagesFolder.getFilesAsync().then(function (files) {
                var promises = [];

                files.forEach(function (file) {
                    var fileCopy = file.copyAsync(indexedFolder, file.name, replaceExistingFile);
                    promises.push(fileCopy);
                });

                return WinJS.Promise.join(promises);
            });
        });

    }

    var copyImagesToIndexedFolder = function () {
        var whenIndexedFolderCreated = localFolder.createFolderAsync(indexedFolderName, replaceExisting);

        var foo = whenIndexedFolderCreated
            .then(copyImagesFromAppPath);
        return foo;
    }

    var getImages = function () {
        var whenFolder = localFolder.getFolderAsync(indexedFolderName);

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
        var fullPath = indexedFolderName + '\\' + fileName;
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

    var getThumbnailSize = function (fileName) {
        var fullPath = thumbnailFolderName + '\\' + fileName;
        var fileOpen = Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fullPath);

        var promise = new WinJS.Promise(function (complete) {
            fileOpen.done(function (fileInfo) {
                fileInfo.properties.getImagePropertiesAsync().then(function (props) {
                    complete(props);
                });
            }, function () {
                complete(false);
            });;
        });

        return promise;
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Shared", {
        copyImagesToIndexedFolder: copyImagesToIndexedFolder,
        getImages: getImages,
        getFileNames: getFileNames,
        thumbnailFileExists: thumbnailFileExists,
        getThumbnailSize: getThumbnailSize
    });
})();