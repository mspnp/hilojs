﻿(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        promise = WinJS.Promise,
        knownFolders = Windows.Storage.KnownFolders,
        search = Windows.Storage.Search,
        commonFileQuery = storage.Search.CommonFileQuery;

    // Image Query Builder Constructor
    // -------------------------------

    // The image query builder an implementation of [the builder pattern][1]
    // providing a flexible API for building queries that find image files on
    // the local system. It builds a [query object][2] which provides an
    // encapsulation of the query that was specified, in an object that can
    // be serialized, deserialized, and executed as needed.
    //
    // [1]: http://en.wikipedia.org/wiki/Builder_pattern
    // [2]: http://martinfowler.com/eaaCatalog/queryObject.html
    //
    // A query object is an alternative to the more tradditional "repository"
    // object, which encapsulates all query logic behind methods such as
    // `getImagesByType('.jpg')`, `getFirstNImages(10)`, etc. Instead of
    // providing a fixed set of methods that are restricted to one implementation,
    // the image query builder provides a set of default options that can be
    // changed as needed, by calling the methods on the builder. Once the builder
    // has been configured with the correct query criteria, a query object can
    // be built from it.
    //
    // ```js
    // var folderToQuery = Windows.Storage.KnownFolders.PicturesLibrary;
    // var queryBuilder = new Hilo.ImageQueryBuilder(folderToQuery);
    //
    // queryBuilder
    //   .count(10)                   // only get 10 images
    //   .forMonthAndYear("Aug 2012"); // only images taken in August 2012
    //
    // var query = queryBuilder.build();
    // query.execute();
    // ```
    // 
    // Once a query has been built, it cannot be modified. The options that were
    // used to build the query are [frozen][3], and any attempt to change them
    // will result in an exception. The `queryBuilder` instance can be re-used,
    // though. Changing the options for the query builder instance will not affect
    // andy existing query objects that were built.
    //
    // [3]: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze

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

    // A type method ("static" in C#) that deserializes a set of queryBuilder
    // options in to a Query object instance. Use this to restore a Query object
    // that was serialized using the `query.serialize()` method;
    //
    // ```js
    // var query = queryBuilder.build();
    // var serializedQuery = query.serialize();
    // 
    // var deserializedQuery = Hilo.ImageQueryBuilder.deserialize(serializedQuery);
    // deserializedQuery.execute();
    // ```
    ImageQueryBuilder.deserialize = function (serializedQueryObject) {
        return new Query(serializedQueryObject);
    };

    // Image Query Builder Methods
    // ---------------------------

    var imageQueryBuilderMethods = {
    
        // Build the query object with all of the settings that have
        // been configured for this builder.
        build: function () {
            return new Query(this._settings);
        },

        // Creates "bindable" objects using the `Hilo.Picture` object,
        // which is required when the resulting image objects must be
        // bound to a UI element, such as a `ListView`.
        bindable: function () {
            return this._set('bindable', true);
        },

        // Set the number of images to retrieve. Setting this will
        // override the `imageAt` setting.
        count: function (count) {
            this._set('startingIndex', 0);
            return this._set('count', count);
        },

        // Load a specific image by the image's index. The index
        // comes from the final set of images that are loaded, and
        // accounts for all other query options. Therefore, changing
        // any query option has the potential to change the index of
        // the image that should be loaded.
        //
        // Setting the `imageAt` option will override the `count` option.
        imageAt: function (index) {
            this._set('startingIndex', index);
            this._set('count', 1);
            return this;
        },

        // Specify a list of attributes to pre-fetch for the images. The
        // default is to load all available `ImageAttributes` for each 
        // image. If fewer attributes should be pre-fetched, specify them
        // with this method, as an array, using the [attribute names][4].
        //
        // [4]: http://msdn.microsoft.com/en-us/library/windows/desktop/dd561977(v=vs.85).aspx
        prefetchOptions: function (attributeArray) {
            this._set('prefetchOption', storage.FileProperties.PropertyPrefetchOptions.none);
            this._set('prefetchAttributes', attributeArray);
            return this;
        },

        // Only pictures taken within the specified month and year will
        // be loaded. The `monthAndYear` parameter should be a string that
        // contains both the month's name and the year in 4-digit form:
        // `Jan 2012`, `August 2001`, etc.
        forMonthAndYear: function (monthAndYear) {
            return this._set('monthAndYear', monthAndYear);
        },

        // Internal method to set a key / value pair, used for
        // building the final query.
        _set: function(key, value){
            this._settings[key] = value;
            return this;
        },

    };

    // Query Object Constructor
    // ------------------------

    // The QueryObject implementation is private within the ImageQueryBuilder
    // module. It cannot be instnatiated directly, but must be created through
    // the use of the ImageQueryBuilder. 

    function QueryObject(settings) {
        // Duplicate and freeze the settings
        var dupSettings = Object.create(settings);
        this.settings = Object.freeze(dupSettings);

        // Build the query options and file query
        this.queryOptions = this._buildQueryOptions();
        this.fileQuery = this._buildFileQuery();
    }

    // Query Object Methods
    // --------------------

    var queryObjectMethods = {

        // Execute the query object. Returns a promise that provides
        // access to an array of objects that was loaded by the 
        // query. This is either [StorageFile][5] objects or `Hilo.Picture`
        // objects.
        //
        // ```js
        // var whenImagesAreReady = query.execute();
        // whenImagesAreReady.then(function(images){
        //   // ... process the images array, here
        // });
        // ```
        //
        // [5]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.storage.storagefile.aspx
        execute: function () {
            var queryPromise;

            if (this.settings.count) {
                // Limit the query to a set number of files to be returned, which accounts
                // for both the `count(n)` and `imageAt(n)` settings from the query builder.
                queryPromise = this.fileQuery.getFilesAsync(this.settings.startingIndex, this.settings.count);
            } else {
                queryPromise = this.fileQuery.getFilesAsync();
            }

            if (this.settings.bindable) {
                // Create `Hilo.Picture` objects instead of returning `StorageFile` objects
                queryPromise = queryPromise.then(this._createViewModels);
            } 

            return queryPromise;
        },

        // Serialize this query object in to a JavaScript object literal as
        // a set of key/value pairs that can be stored as a string, 
        // transfered as JSON data, or otherwise manipulated.
        serialize: function () {
            return this.settings;
        },

        // Internal method to take the options specified in the queryb uilder
        // and turn them in to a [QueryOptions][6] object. 
        //
        // Note that not all settings from the query builder are applicable
        // to the resulting `QueryObject`. Some of them are applied in the
        // `execute` method, instead.
        //
        // [6]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.storage.search.queryoptions.aspx
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

        // Internal method. Converts a QueryOptions object in to a file query.
        _buildFileQuery: function () {
            return this.settings.folder.createFileQueryWithOptions(this.queryOptions);
        },

        // Internal method. Wraps the original `StorageFile` objects in 
        // `Hilo.Picture` objects, so that they can be bound to UI controls
        // such as the `WinJS.UI.ListView`.
        _createViewModels: function (files) {
            return WinJS.Promise.wrap(files.map(Hilo.Picture.from));
        }
    };

    // Define the final `Query` class by combining the `QueryObject`
    // constructor function with the `queryObjectMethods` object literal.
    // Note that this is still private within the `ImageQueryBuilder` module.
    var Query = WinJS.Class.define(QueryObject, queryObjectMethods);

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo", {
        ImageQueryBuilder: WinJS.Class.define(ImageQueryBuilder, imageQueryBuilderMethods)
    });

})();