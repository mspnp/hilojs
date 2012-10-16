// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------
    var search = Windows.Storage.Search,
        fileProperties = Windows.Storage.FileProperties,
        commonFolderQuery = Windows.Storage.Search.CommonFolderQuery,
        viewStates = Windows.UI.ViewManagement.ApplicationViewState;

    var itemDateProperty = "System.ItemDate";
    var maxImagesPerGroup = 8;

    function MonthPresenterConstructor(loadingIndicatorEl, semanticZoom, zoomOutListView, zoomInListView) {

        this.loadingIndicatorEl = loadingIndicatorEl;
        this.semanticZoom = semanticZoom;

        this.zoomInListView = zoomInListView;
        this.zoomOutListView = zoomOutListView;

        this._buildYearGroups = this._buildYearGroups.bind(this);
        this._queryImagesPerMonth = this._queryImagesPerMonth.bind(this);
        this._buildViewModelsForMonths = this._buildViewModelsForMonths.bind(this);
        this._createDataSources = this._createDataSources.bind(this);
        this._setupListViews = this._setupListViews.bind(this);
        this._imageInvoked = this._imageInvoked.bind(this);
        this._selectionChanged = this._selectionChanged.bind(this);
    };

    var monthPresenterMembers = {

        start: function (targetFolder) {
            var self = this;

            this.semanticZoom.enableButton = false;
            this.groupsByKey = {};
            this.displayedImages = [];

            return this._getMonthFoldersFor(targetFolder)
                .then(this._queryImagesPerMonth)
                .then(this._buildViewModelsForMonths)
                .then(this._createDataSources)
                .done(function (dataSources) {
                    self._setupListViews(dataSources.images, dataSources.years);
                    self.loadingIndicatorEl.style.display = "none";
                    self.semanticZoom.enableButton = true;
                });
        },

        _getMonthFoldersFor: function (folder) {
            var queryOptions = new search.QueryOptions(commonFolderQuery.groupByMonth);
            var query = folder.createFolderQueryWithOptions(queryOptions);
            return query.getFoldersAsync(0);
        },

        _getImageQueryOptions: function () {
            var queryOptions = new search.QueryOptions(search.CommonFileQuery.orderByDate, [".jpg", ".jpeg", ".tiff", ".png", ".bmp", ".gif"]);
            queryOptions.setPropertyPrefetch(fileProperties.PropertyPrefetchOptions.none, [itemDateProperty]);
            queryOptions.setThumbnailPrefetch(fileProperties.ThumbnailMode.picturesView, 190, fileProperties.ThumbnailOptions.useCurrentScale);
            queryOptions.indexerOption = search.IndexerOption.useIndexerWhenAvailable;
            return queryOptions;
        },

        _queryImagesPerMonth: function (monthFolders) {
            var self = this;

            var groupsByKey = {};
            self.groupsByKey = groupsByKey;

            var queryOptions = self._getImageQueryOptions();

            var getCountsPerFolder = monthFolders.map(function (monthGroup) {

                var query = monthGroup.createFileQueryWithOptions(queryOptions);

                return query
                    .getItemCountAsync()
                    .then(function (count) {
                        return {
                            groupKey: monthGroup.name,
                            query: query,
                            count: count
                        };
                    });
            });

            return WinJS.Promise.join(getCountsPerFolder);
        },

        _buildViewModelsForMonths: function (foldersWithCount) {
            var self = this;
            var firstItemIndexHint = 0;
            var filesInFolder;

            var promise = WinJS.Promise.as();
            var groups = [];

            var foldersWithImages = foldersWithCount.filter(function (data) { return data.count > 0; });

            var buildViewModels = foldersWithImages.map(function (folder) {
                promise = promise.then(function () {
                    return folder.query
                    .getFilesAsync(0, maxImagesPerGroup)
                    .then(function (files) {
                        filesInFolder = files;
                        // Since we filtered for zero count, we 
                        // can assume that we have at least 1 file
                        return files.getAt(0).properties.retrievePropertiesAsync([itemDateProperty]);
                    })
                    .then(function (retrieved) {
                        var date = retrieved[itemDateProperty];
                        var groupKey = (date.getFullYear() * 100) + (date.getMonth());

                        filesInFolder.forEach(function (file) {
                            var image = new Hilo.Picture(file);
                            image.groupKey = groupKey;
                            self.displayedImages.push(image);
                        });

                        var monthGroupViewModel = {
                            itemDate: date,
                            title: folder.groupKey,
                            sortOrder: groupKey,
                            count: folder.count,
                            firstItemIndexHint: firstItemIndexHint,
                            groupKey: date.getFullYear().toString()
                        };

                        firstItemIndexHint += filesInFolder.size;
                        self.groupsByKey[groupKey] = monthGroupViewModel;
                        groups.push(monthGroupViewModel);
                    });
                });
            });
            return promise.then(function () { return groups; });
        },

        _createDataSources: function (monthGroups) {
            var self = this;

            function groupKey(item) {
                return item.groupKey;
            }

            function groupData(item) {
                var group = self.groupsByKey[item.groupKey];
                return {
                    title: group.title.replace(" ", "&nbsp;"),
                    count: group.count
                };
            }

            function groupSort(left, right) {
                return right - left;
            }

            var imageList = new WinJS.Binding.List(this.displayedImages).createGrouped(groupKey, groupData, groupSort);

            var yearGroups = this._buildYearGroups(monthGroups);
            var yearList = new WinJS.Binding.List(yearGroups);

            return {
                images: imageList,
                years: yearList
            };
        },

        _buildYearGroups: function (monthGroups) {
            var years = [];
            var current = {};

            monthGroups.forEach(function (monthGroup) {
                var year = monthGroup.itemDate.getFullYear();
                var month = monthGroup.itemDate.getMonth();
                if (current.year !== year) {

                    current = {
                        year: year,
                        months: []
                    };
                    years.push(current);
                }

                current.months[month] = monthGroup;
            });

            return years;
        },

        _buildQueryForPicture: function (item) {

            var picture = item.data;

            // Build a query to represent the month/year group that was selected
            var query = this.queryBuilder
                .bindable()                     // ensure the images are data-bind-able
                .forMonthAndYear(picture.itemDate)     // only load images for the month and year group we selected
                .build(this.targetFolder);

            var group = this.groupsByKey[item.groupKey];
            var indexInGroup = item.index - group.firstItemIndexHint

            return {
                query: query,
                itemIndex: indexInGroup,
                itemName: picture.name
            };
        },

        _setupListViews: function (imageList, yearList) {

            this.zoomOutListView.itemDataSource = imageList.dataSource;
            this.zoomOutListView.groupDataSource = imageList.groups.dataSource;

            this.zoomOutListView.addEventListener("iteminvoked", this._imageInvoked.bind(this));
            this.zoomOutListView.addEventListener("selectionchanged", this._selectionChanged.bind(this));

            this.zoomInListView.setItemDataSource(yearList.dataSource);
        },

        _imageInvoked: function (args) {
            var self = this;

            return args.detail.itemPromise.then(function (item) {

                var options = self._buildQueryForPicture(item);
                // Navigate to the detail page to show the results
                // of this query with the selected item
                self.navigate("/Hilo/detail/detail.html", options);
            });
        },

        _selectionChanged: function (args) {
            var self = this;

            this.monthgroup.selection
                .getItems()
                .then(function (items) {
                    if (items[0]) {
                        var selected = items[0];
                        var options = self._buildQueryForPicture(selected);
                        self.imageNav.setNavigationOptions(options, true);
                    } else {
                        self.imageNav.clearNavigationOptions(true);
                    }
                });
        }
    };

    WinJS.Namespace.define("Hilo.month", {
        MonthPresenter: WinJS.Class.define(MonthPresenterConstructor, monthPresenterMembers)
    });
})();