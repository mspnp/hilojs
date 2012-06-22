describe('The repository for local pictures', function () {
    'use strict';

    var
        pages = {},
        async = { it: Hilo.specs.helpers.async, xit: function () { /* ignore */} },
        mock;

    beforeEach(function () {

        mock = new Hilo.specs.helpers.mocking().handle;

        mock('Windows.Storage.KnownFolders.picturesLibrary', {
            createFileQueryWithOptions: function () { }
        });
        mock.asClass('Windows.Storage.Search.QueryOptions');
        mock.asClass('Windows.Storage.BulkAccess.FileInformationFactory', null, {
            getFilesAsync: function () {
                return WinJS.Promise.wrap();
            }
        });
        mock('Windows.Storage.Search.CommonFileQuery.orderByDate', {});
        mock('Windows.Storage.FileProperties.ThumbnailMode.singleItem', {});
        mock('Windows.Storage.FileProperties.ThumbnailOptions.none', {});

        mock('WinJS.UI.Pages', {
            define: function (url, page) {
                pages[url] = page;
            }
        });
    });

    it('should query the file system for the first six images', function () {

        mock.asClass('Windows.Storage.BulkAccess.FileInformationFactory', null, {
            getFilesAsync: function (start, count) {
                expect(start).toBe(0);
                expect(count).toBe(6);
                return WinJS.Promise.wrap([]);
            }
        });

        return Hilo.PicturesRepository(mock.require).getPreviewImages();
    });

    it('should include .jpg files', function () {

        mock.asClass('Windows.Storage.Search.QueryOptions', function (query, filter) {
            expect(filter).toContain('.jpg');
        });

        return Hilo.PicturesRepository(mock.require).getPreviewImages();
    });

    it('should order by date', function () {

        mock.asClass('Windows.Storage.Search.QueryOptions', function (query, filter) {
            expect(query).toBe(mock.require('Windows.Storage.Search.CommonFileQuery.orderByDate'));
        });

        return Hilo.PicturesRepository(mock.require).getPreviewImages();
    });

    it('should create a query with the expected options', function () {

        mock.asClass('Windows.Storage.BulkAccess.FileInformationFactory', function (query, mode, minimum_size, options, delayLoad) {
            expect(mode).toBe(mock.require('Windows.Storage.FileProperties.ThumbnailMode.singleItem'), 'mode');
            expect(minimum_size).toBe(310, 'minimum_size');
            expect(options).toBe(mock.require('Windows.Storage.FileProperties.ThumbnailOptions.none'), 'options');
            expect(delayLoad).toBe(true, 'delayLoad');

        });

        return Hilo.PicturesRepository(mock.require);
    });

    async.it('should retrieve the name and url for each image', function () {
        mock.asClass('Windows.Storage.BulkAccess.FileInformationFactory', null, {
            getFilesAsync: function () {
                return WinJS.Promise.wrap([{ name: '', thumbnail: new Blob() }]);
            }
        });
        return Hilo.PicturesRepository(mock.require).getPreviewImages();
    }, function (images) {
        var first = images[0];
        expect(first.name).toBeDefined('name');
        expect(first.url).toBeDefined('url');
    });

});