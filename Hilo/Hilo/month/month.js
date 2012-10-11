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
        commonFolderQuery = Windows.Storage.Search.CommonFolderQuery,
        viewStates = Windows.UI.ViewManagement.ApplicationViewState;

    // Page Control
    // ------------

    var monthPageControlMembers = {

        // Imports
        // -------
        _dateFormatter: Hilo.dateFormatter,
        targetFolder: Windows.Storage.KnownFolders.picturesLibrary,
        navigate: WinJS.Navigation.navigate,

        // Public API
        // ----------

        ready: function (element, options) {
            var self = this;

            this.queryBuilder = new Hilo.ImageQueryBuilder();

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            var appBarEl = document.querySelector("#appbar");
            this.imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(appBarEl, WinJS.Navigation);

            var loadingIndicator = document.querySelector("#loadingProgress");
            var semanticZoom = document.querySelector(".semanticZoomContainer").winControl;
            semanticZoom.enableButton = false;

            var imageList;
            var yearList;

            var start = new Date();
            var itemDate = "System.ItemDate";

            var months = this._getMonthFoldersFor(this.targetFolder);
            months.then(function (monthFolders) {

                var groupsByKey = {};
                self.groupsByKey = groupsByKey;
                var displayedImages = [];
                var maxImagesPerGroup = 8;

                var queryOptions = new search.QueryOptions(search.CommonFileQuery.orderByDate, [".jpg", ".jpeg", ".tiff", ".png", ".bmp", ".gif"]);
                queryOptions.setPropertyPrefetch(Windows.Storage.FileProperties.PropertyPrefetchOptions.none, ["System.ItemDate"]);
                queryOptions.setThumbnailPrefetch(Windows.Storage.FileProperties.ThumbnailMode.picturesView, 190, Windows.Storage.FileProperties.ThumbnailOptions.useCurrentScale);
                queryOptions.indexerOption = search.IndexerOption.useIndexerWhenAvailable;

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

                return WinJS.Promise.join(getCountsPerFolder)
                    .then(function (foldersWithCount) {
                        var foldersWithImages = foldersWithCount.filter(function (data) { return data.count > 0; });
                        var firstItemIndexHint = 0;
                        var filesInFolder;

                        var promise = WinJS.Promise.as();
                        var groups = [];

                        var buildViewModels = foldersWithImages.map(function (folder) {
                            promise = promise.then(function () {
                                return folder.query
                                .getFilesAsync(0, maxImagesPerGroup)
                                .then(function (files) {
                                    filesInFolder = files;
                                    // Since we filtered for zero count, we 
                                    // can assume that we have at least 1 file
                                    return files.getAt(0).properties.retrievePropertiesAsync([itemDate]);
                                })
                                .then(function (retrieved) {
                                    var date = retrieved[itemDate];
                                    var groupKey = (date.getFullYear() * 100) + (date.getMonth());

                                    filesInFolder.forEach(function (file) {
                                        var image = new Hilo.Picture(file);
                                        image.groupKey = groupKey;
                                        displayedImages.push(image);
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
                                    groupsByKey[groupKey] = monthGroupViewModel;
                                    groups.push(monthGroupViewModel);
                                });
                            });
                        });
                        return promise.then(function(){ return groups; });
                    })
                    .then(function (monthGroups) {

                        imageList = new WinJS.Binding.List(displayedImages).createGrouped(
                            function groupKey(item) {
                                return item.groupKey;
                            },
                            function groupData(item) {
                                var group = groupsByKey[item.groupKey];
                                return {
                                    title: group.title.replace(" ", "&nbsp;"),
                                    count: group.count
                                };
                            }, function groupSort(left, right) {
                                return right - left;
                            });

                        var yearGroups = self._buildYearGroups(monthGroups);
                        yearList = new WinJS.Binding.List(yearGroups);
                    })
                    .done(function () {
                        console.log((new Date() - start) / 1000);
                        self._setup(imageList, yearList);
                        loadingIndicator.style.display = "none";
                        semanticZoom.enableButton = true;
                    });
            });

            this._buildYearGroups = this._buildYearGroups.bind(this);
        },

        updateLayout: function (element, viewState, lastViewState) {
            if (viewState !== lastViewState) {
                this._setLayout(viewState);
            }
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.UrlCache.clearAll();
        },

        // Private Methods
        // ---------------
        _setup: function (imageList, yearList) {

            var monthgroup = document.querySelector("#monthgroup").winControl;
            monthgroup.itemDataSource = imageList.dataSource;
            monthgroup.groupDataSource = imageList.groups.dataSource;

            monthgroup.addEventListener("iteminvoked", this._imageInvoked.bind(this));
            monthgroup.addEventListener("selectionchanged", this._selectionChanged.bind(this));
            this.monthgroup = monthgroup;

            var yeargroup = document.querySelector("#yeargroup").winControl;
            yeargroup.setItemDataSource(yearList.dataSource);
        },

        _getMonthFoldersFor: function (folder) {
            var queryOptions = new search.QueryOptions(commonFolderQuery.groupByMonth);
            var query = folder.createFolderQueryWithOptions(queryOptions);
            return query.getFoldersAsync(0);
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

    var MonthPageControl = Hilo.controls.pages.define("month", monthPageControlMembers);

    WinJS.Namespace.define("Hilo.month", { pageControl: MonthPageControl });

})();
