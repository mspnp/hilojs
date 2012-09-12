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

    // Page Control
    // ------------

    var monthPageControlMembers = {

        // Imports
        // -------
        getMonthYearFrom: Hilo.dateFormatter.getMonthYearFrom,
        targetFolder: Windows.Storage.KnownFolders.picturesLibrary,
        navigate: WinJS.Navigation.navigate,

        // Public API
        // ----------

        ready: function (element, options) {

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            this.queryBuilder = new Hilo.ImageQueryBuilder();

            var appBarEl = document.querySelector("#appbar");
            this.imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(appBarEl, WinJS.Navigation);

            // First, setup the various data adapters needed
            this.monthGroups = new Hilo.month.Groups(this.queryBuilder, this.targetFolder, this.getMonthYearFrom);
            this.monthGroupMembers = new Hilo.month.Members(this.queryBuilder, this.targetFolder, this.getMonthYearFrom);

            var yearGroupMembers = this._setYearGroupDataAdapter(this.monthGroups);
            var yearGroups = yearGroupMembers.groups;

            // Then provide the adapters to the list view controls
            this._setupMonthGroupListView(this.monthGroups, this.monthGroupMembers);
            this._setupYearGroupListView(yearGroups, yearGroupMembers);
        },

        updateLayout: function (element, viewState, lastViewState) {
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
        },

        // Private Methods
        // ---------------

        _setYearGroupDataAdapter: function (monthGroups) {
            var yearGroupMembers = WinJS.UI.computeDataSourceGroups(monthGroups, function (item) {
                return item.groupKey
            }, function (item) {
                return { title: item.groupKey }
            });
            return yearGroupMembers;
        },

        _setupYearGroupListView: function (groups, members) {
            var listview = document.querySelector("#yeargroup").winControl;
            listview.itemDataSource = members;
            listview.groupDataSource = groups;
            listview.layout.maxRows = 3;
        },

        _setupMonthGroupListView: function (groups, members) {
            var listview = document.querySelector("#monthgroup").winControl;
            listview.groupDataSource = groups;
            listview.itemDataSource = members;
            listview.addEventListener("iteminvoked", this._imageInvoked.bind(this));
            listview.addEventListener("selectionchanged", this._selectionChanged.bind(this));

            this.monthListView = listview;
        },

        _determineIndexInGroup: function (absoluteItemIndex, groupKey) {
            var firstIndex = this.monthGroups.getFirstIndexForGroup(groupKey);
            return absoluteItemIndex - firstIndex;
        },

        _buildQueryForPicture: function (item) {

            var picture = item.data;
            var monthYear = this.getMonthYearFrom(picture.itemDate);

            // Build a query to represent the month/year group that was selected
            var query = this.queryBuilder
                .bindable()                     // ensure the images are data-bind-able
                .forMonthAndYear(monthYear)     // only load images for the month and year group we selected
                .build(this.targetFolder);

            var groupIndex = this._determineIndexInGroup(item.index, monthYear);

            return {
                query: query,
                itemIndex: groupIndex,
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

            this.monthListView.selection
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
