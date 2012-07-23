(function () {

    var storage = Windows.Storage,
        thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
        orderByDate = storage.Search.CommonFileQuery.orderByDate;

    WinJS.Namespace.define('Hilo', {
        ImageRepository: WinJS.Class.define(function (folder) {
            this.folder = folder;
        },
        {
            getImages: function (count) {
                var folder = this.folder;
                //var queryOptions = new storage.Search.QueryOptions(orderByDate, ['.jpg']);
                var queryOptions = new storage.Search.QueryOptions();
                var wat = folder.areQueryOptionsSupported(queryOptions);
                var wut = folder.isCommonFileQuerySupported(orderByDate);
                var queryResult = folder.createFileQueryWithOptions(queryOptions);

                var factory = new storage.BulkAccess.FileInformationFactory(queryResult, thumbnailMode);

                return factory.getFilesAsync(0, count).done(null, function () { debugger; });
            }
        })
    });

})();