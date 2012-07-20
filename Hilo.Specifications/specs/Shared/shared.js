(function () {
    "use strict";

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

    WinJS.Namespace.define("Shared", {
        getImages: getImages,
        getFileNames: getFileNames
    });
})();