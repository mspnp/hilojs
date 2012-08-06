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
        this._set('fileTypes', ['.jpg', '.png', '.bmp', '.tiff', '.gif']);
        this._set('thumbnailMode', storage.FileProperties.ThumbnailMode.singleItem);
        this._set('thumbnailSize', 1024);
        this._set('sortOrder', commonFileQuery.orderByDate);
        this._set('indexerOption', search.IndexerOption.useIndexerWhenAvailable);
        this._set('count', 15);
    }

    ImageQueryBuilder.deserialize = function (serializedQueryObject) {
        return new Query(serializedQueryObject);
    };

    var imageQueryBuilderMethods = {
        
        build: function () {
            return new Query(this._settings);
        },

        count: function(count){
            return this._set('count', count);
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
            return this.fileQuery.getFilesAsync(0, this.settings.count);
        },

        serialize: function () {
            return this.settings;
        },

        _buildQueryOptions: function () {
            var queryOptions = new storage.Search.QueryOptions(this.settings.sortOrder, this.settings.fileTypes);
            queryOptions.indexerOption = this.settings.indexerOption;

            return queryOptions;
        },

        _buildFileQuery: function () {
            return this.settings.folder.createFileQueryWithOptions(this.queryOptions);
        }
    };

    var Query = WinJS.Class.define(QueryObject, queryObjectMethods);

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo", {
        ImageQueryBuilder: WinJS.Class.define(ImageQueryBuilder, imageQueryBuilderMethods)
    });

})();