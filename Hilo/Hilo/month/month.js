// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";

    var monthPageControlMembers = {

        // Imports
        // -------
        getMonthYearFrom: Hilo.dateFormatter.getMonthYearFrom,
        targetFolder: Windows.Storage.KnownFolders.picturesLibrary,
        navigate: WinJS.Navigation.navigate,

        // Public API
        // ----------

        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            Hilo.controls.checkOptions(options);

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            this.queryBuilder = new Hilo.ImageQueryBuilder();

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
        },

        _determineIndexInGroup: function (absoluteItemIndex, groupKey) {
            var firstIndex = this.monthGroups.getFirstIndexForGroup(groupKey);
            return absoluteItemIndex - firstIndex;
        },

        _imageInvoked: function (args) {
            var self = this;

            return args.detail.itemPromise.then(function (item) {

                var monthYear = self.getMonthYearFrom(item.data.itemDate);

                // Build a query to represent the month/year group that was selected
                var query = self.queryBuilder
                    .bindable()                     // ensure the images are data-bind-able
                    .forMonthAndYear(monthYear)     // only load images for the month and year group we selected
                    .build(self.targetFolder);

                var selected = self._determineIndexInGroup(item.index, monthYear);

                // Navigate to the detail view to show the results of this query with the selected item
                self.navigate("/Hilo/detail/detail.html", { query: query, itemIndex: selected });
            });
        }
    };

    var MonthPageControl = WinJS.UI.Pages.define("/Hilo/month/month.html", monthPageControlMembers);

    WinJS.Namespace.define("Hilo.month", { pageControl: MonthPageControl });

})();
