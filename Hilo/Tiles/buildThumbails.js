(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var applicationData = Windows.Storage.ApplicationData;
    var creationCollisionOption = Windows.Storage.CreationCollisionOption;
    var replaceExisting = creationCollisionOption.replaceExisting;
    var thumbnailFolderName = 'tile-thumbnails';

    // Private Methods
    // ---------------

    function buildThumbnails(files) {
        var localFolder = applicationData.current.localFolder;

        // partially apply the photocopier to carry the files parameter with it,
        // allowing it to be used as a promise/callback that only needs to have
        // the `folder` parameter supplied.
        var copyThumbnailsToFolder = Tiles.photoCopier.bind(null, files);

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