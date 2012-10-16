// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    'use strict';

    // Imports And Variables
    // ---------------------
    var commonFileQuery = Windows.Storage.Search.CommonFileQuery;

    function retrieveItemDate(files) {

        if (files.length !== 1) { throw new Error("expected a single file"); }

        // If the array contains at least one file, then we want to
        // retrieve the itemDate from that file.
        return files[0].properties
            .retrievePropertiesAsync(["System.ItemDate"])
            .then(function (retrieved) {
                return retrieved.lookup("System.ItemDate");
            });
    }

    // Private Methods
    // ---------------

    var DataAdapter = WinJS.Class.define(function (queryBuilder, folder, dateFormatter) {
        var self = this;

        this._query = queryBuilder.build(folder);
        this._dateFormatter = dateFormatter;

        this._initialized = false;

        this._cache = {};

        this._getGroupForYearMonth = this._getGroupForYearMonth.bind(this, folder);

    }, {
        initialize: function (callback) {

            if (this._initialized) { return callback(); }

            var self = this;
            var query = this._query.fileQuery;

            var newest = query
                .getFilesAsync(0, 1)
                .then(retrieveItemDate);

            var oldest = query
                .getItemCountAsync()
                .then(function (count) {
                    var lastIndex = count - 1;
                    return query.getFilesAsync(lastIndex, 1);
                })
                .then(retrieveItemDate);

            return WinJS.Promise
                .join([newest, oldest])
                .then(function (results) {
                    var years = self._createItemsBetween(results[0], results[1]);
                    self.years = years;
                    self.totalCount = years.length;
                    self._initialized = true;
                    return callback();
                });
        },

        itemsFromIndex: function (requestIndex, countBefore, countAfter) {

            var self = this;

            var start = Math.max(0, requestIndex - countBefore),
                count = 1 + countBefore + countAfter,
                offset = requestIndex - start;

            return this.initialize(function () {

                var local = self.years.slice(start, start + count);
                var result = {
                    items: local,
                    offset: offset,
                    absoluteIndex: start
                };

                if (self.totalCount) {
                    result.totalCount = self.totalCount;
                }

                return WinJS.Promise.as(result);
            });

        },

        getCount: function () {
            var self = this;
            return this.initialize(function () {
                return WinJS.Promise.as(self.totalCount);
            });
        },

        itemsFromKey: function (key, countBefore, countAfter) {
            var self = this;
            return this.initialize(function () {
                var index;
                self.years.some(function (item, i) {
                    if (item.key === key) {
                        index = i;
                    }
                });
                return self.itemsFromIndex(index, countBefore, countAfter);
            });
        },

        _getGroupForYearMonth: function (folder, year, month) {
            var self = this;
            var cacheId = year + "]]" + month;
            var fromCache = self._cache[cacheId];

            if (fromCache) {
                return WinJS.Promise.as(fromCache);
            } else {

                var queryOptions = self._query.queryOptions;
                var filter = self._dateFormatter.createFilterRangeFromYearAndMonth(year, month);
                queryOptions.applicationSearchFilter = filter;

                return folder.createFileQueryWithOptions(queryOptions)
                    .getItemCountAsync()
                    .then(function (count) {
                        var group = {
                            year: year,
                            month: month,
                            count: count
                        };

                        self._cache[cacheId] = group;

                        return group;
                    });
            }
        },

        _createItemsBetween: function (newest, oldest) {
            var newestYear = newest.getFullYear();
            var oldestYear = oldest.getFullYear();
            var years = [];
            var months;

            for (var year = newestYear; year >= oldestYear; year--) {

                months = this._createMonthsForYear(year);

                years.push({
                    key: year,
                    data: {
                        title: year,
                        months: months
                    }
                });
            }
            return years;
        },

        _createMonthsForYear: function (year) {
            var date, name, groupPromise;
            var months = [];

            for (var month = 0; month < 12; month++) {
                date = new Date(year, month);
                groupPromise = this._getGroupForYearMonth(year, month);
                months.push({
                    index: month,
                    name: this._dateFormatter.getMonthFrom(date),
                    itemPromise: groupPromise
                });
            }

            return months;
        }
    });

    var Years = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function (queryBuilder, folder, dateFormatter) {
        this.adapter = new DataAdapter(queryBuilder, folder, dateFormatter);
        this._baseDataSourceConstructor(this.adapter);
    });

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.month', {
        Years: Years
    });

})();
