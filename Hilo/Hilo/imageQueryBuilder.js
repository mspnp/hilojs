(function () {
    'use strict';

    // Imports And Constants
    var storage = Windows.Storage,
        promise = WinJS.Promise,
        knownFolders = Windows.Storage.KnownFolders,
        search = Windows.Storage.Search,
        commonFileQuery = storage.Search.CommonFileQuery;

    // Image Query Builder
    // -------------------

    function ImageQueryBuilder(folder) {
        this._settings = {};
        this._set('folder', folder);
        this._set('fileTypes', ['.jpg', '.jpeg', '.tiff', '.png', '.bmp', '.gif']);
        this._set('prefetchOption', storage.FileProperties.PropertyPrefetchOptions.imageProperties);

        this._set('thumbnailOptions', Windows.Storage.FileProperties.ThumbnailOptions.useCurrentScale);
        this._set('thumbnailMode', storage.FileProperties.ThumbnailMode.singleItem);
        this._set('thumbnailSize', 1024);

        this._set('sortOrder', commonFileQuery.orderByDate);
        this._set('indexerOption', search.IndexerOption.useIndexerWhenAvailable);
        this._set('startingIndex', 0);
        this._set('bindable', false);
    }

    ImageQueryBuilder.deserialize = function (serializedQueryObject) {
        return new Query(serializedQueryObject);
    };

    var imageQueryBuilderMethods = {
        
        build: function () {
            return new Query(this._settings);
        },

        bindable: function () {
            return this._set('bindable', true);
        },

        count: function(count){
            return this._set('count', count);
        },

        imageAt: function (index) {
            this._set('startingIndex', index);
            this._set('count', 1);
            return this;
        },

        prefetchOptions: function (attributeArray) {
            this._set('prefetchOption', storage.FileProperties.PropertyPrefetchOptions.none);
            this._set('prefetchAttributes', attributeArray);
            return this;
        },

        forMonthAndYear: function (monthAndYear) {
            return this._set('monthAndYear', monthAndYear);
        },

        _set: function(key, value){
            this._settings[key] = value;
            return this;
        },

    };

    // Query Object
    // ------------

    function QueryObject(settings) {
        var dupSettings = Object.create(settings);
        this.settings = Object.freeze(dupSettings);

        this.queryOptions = this._buildQueryOptions();
        this.fileQuery = this._buildFileQuery();
    }

    var queryObjectMethods = {
        execute: function () {
            var queryPromise;

            if (this.settings.count) {
                queryPromise = this.fileQuery.getFilesAsync(this.settings.startingIndex, this.settings.count);
            } else {
                queryPromise = this.fileQuery.getFilesAsync();
            }

            if (this.settings.bindable) {
                return queryPromise.then(this._createViewModels);
            } else {
                return queryPromise;
            }
        },

        serialize: function () {
            return this.settings;
        },

        _buildQueryOptions: function () {
            var queryOptions = new storage.Search.QueryOptions(this.settings.sortOrder, this.settings.fileTypes);
            queryOptions.indexerOption = this.settings.indexerOption;

            queryOptions.setPropertyPrefetch(this.settings.prefetchOption, this.settings.prefetchAttributes);
            queryOptions.setThumbnailPrefetch(this.settings.thumbnailMode, this.settings.thumbnailSize, this.settings.thumbnailOptions);

            if (this.settings.monthAndYear) {
                queryOptions.applicationSearchFilter = 'System.ItemDate: ' + this.settings.monthAndYear;
            }

            return queryOptions;
        },

        _buildFileQuery: function () {
            return this.settings.folder.createFileQueryWithOptions(this.queryOptions);
        },

        _createViewModels: function (files) {
            return WinJS.Promise.wrap(files.map(Hilo.Picture.from));
        }
    };

    var Query = WinJS.Class.define(QueryObject, queryObjectMethods);

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo", {
        ImageQueryBuilder: WinJS.Class.define(ImageQueryBuilder, imageQueryBuilderMethods)
    });

})();