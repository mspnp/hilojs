(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var applicationData = Windows.Storage.ApplicationData,
        creationCollisionOption = Windows.Storage.CreationCollisionOption,
        replaceExisting = creationCollisionOption.replaceExisting,
        thumbnailFolderName = 'tile-thumbnails';

    // Private Methods
    // ---------------

    function buildThumbnails(files) {
        var localFolder = applicationData.current.localFolder;

        // partially apply the photocopier to carry the files parameter with it,
        // allowing it to be used as a promise/callback that only needs to have
        // the `folder` parameter supplied.
        var copyThumbnailsToFolder = Tiles.copyImages.bind(null, files);

        // Promise to build the thumbnails and return the list of local file paths
        var whenFolderCreated = localFolder.createFolderAsync(thumbnailFolderName, replaceExisting);
        return whenFolderCreated
            .then(copyThumbnailsToFolder)
    }

    // Public API
    // ----------

    WinJS.Namespace.define('Tiles', {
        buildThumbails: buildThumbnails
    });

})();