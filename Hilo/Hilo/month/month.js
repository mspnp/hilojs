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

    var viewStates = Windows.UI.ViewManagement.ApplicationViewState;

    // Side-effect free functions
    function groupKeyFromDate(date) {
        var month = date.getMonth();
        var year = date.getFullYear();
        return year + "::" + month;
    }

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

            var currentViewState = Windows.UI.ViewManagement.ApplicationView.value;
            this._setLayout(currentViewState);

            WinJS.Application.addEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);

            this.queryBuilder = new Hilo.ImageQueryBuilder();

            var appBarEl = document.querySelector("#appbar");
            this.imageNav = new Hilo.Controls.ImageNav.ImageNavPresenter(appBarEl, WinJS.Navigation);

            // First, setup the various data adapters needed
            this.monthGroups = new Hilo.month.Groups(this.queryBuilder, this.targetFolder, this._dateFormatter);
            this.monthGroupMembers = new Hilo.month.Members(this.queryBuilder, this.targetFolder, this._dateFormatter);
            this._setupMonthGroupListView(this.monthGroups, this.monthGroupMembers);

            // <SnippetHilojs_1708>
            var yearGroupMembers = new Hilo.month.Years(this.queryBuilder, this.targetFolder, this._dateFormatter, this.monthGroups.getGroupByKey);

            var yearList = document.querySelector("#yeargroup").winControl;
            yearList.setItemDataSource(yearGroupMembers);
            yearList.getGroupForMonthYear = function (data) {
                var groupKey = groupKeyFromDate(new Date(data.year, data.month));
                return self.monthGroups.getGroupByKey(groupKey);
            };
            // </SnippetHilojs_1708>
        },

        updateLayout: function (element, viewState, lastViewState) {
            if (viewState !== lastViewState) {
                this._setLayout(viewState);
            }
        },

        unload: function () {
            WinJS.Application.removeEventListener("Hilo:ContentsChanged", Hilo.navigator.reload);
            Hilo.Picture.revokeUrls();
        },

        // Private Methods
        // ---------------

        _setLayout: function (viewState) {
            //Hilo.navigator.reload();
            var yearGroup = document.querySelector("#yeargroup");
            var monthGroup = document.querySelector("#monthgroup");

            var layout;
            if (viewState === viewStates.snapped) {
                layout = WinJS.UI.ListLayout;
            } else {
                layout = WinJS.UI.GridLayout;
            };

            yearGroup.winControl.setLayout(new layout());
            monthGroup.winControl.layout = new layout();
        },

        _setupMonthGroupListView: function (groups, members) {
            var listview = document.querySelector("#monthgroup").winControl;
            listview.groupDataSource = groups;
            listview.itemDataSource = members;
            listview.addEventListener("iteminvoked", this._imageInvoked.bind(this));
            listview.addEventListener("selectionchanged", this._selectionChanged.bind(this));

            this.monthListView = listview;
        },

        _determineIndexInGroup: function (absoluteItemIndex, itemDate) {
            var groupKey = groupKeyFromDate(itemDate);
            return this.monthGroups.getGroupByKey(groupKey)
                .then(function (group) {
                    return absoluteItemIndex - group.firstItemIndexHint;
                });
        },

        _buildQueryForPicture: function (item) {

            var picture = item.data;

            // Build a query to represent the month/year group that was selected
            var query = this.queryBuilder
                .bindable()                     // ensure the images are data-bind-able
                .forMonthAndYear(picture.itemDate)     // only load images for the month and year group we selected
                .build(this.targetFolder);

            return this._determineIndexInGroup(item.index, picture.itemDate)
            .then(function (groupIndex) {
                return {
                    query: query,
                    itemIndex: groupIndex,
                    itemName: picture.name
                };
            });
        },

        _imageInvoked: function (args) {
            var self = this;

            return args.detail.itemPromise.then(function (item) {

                return self._buildQueryForPicture(item).
                    then(function (options) {
                        // Navigate to the detail page to show the results
                        // of this query with the selected item
                        self.navigate("/Hilo/detail/detail.html", options);
                    });
            });
        },

        _selectionChanged: function (args) {
            var self = this;

            this.monthListView.selection
                .getItems()
                .then(function (items) {
                    if (items[0]) {
                        var selected = items[0];
                        return self._buildQueryForPicture(selected)
                            .then(function (options) {
                                self.imageNav.setNavigationOptions(options, true);
                            });
                    } else {
                        self.imageNav.clearNavigationOptions(true);
                    }
                });
        }
    };

    var MonthPageControl = Hilo.controls.pages.define("month", monthPageControlMembers);

    WinJS.Namespace.define("Hilo.month", { pageControl: MonthPageControl });
    WinJS.Namespace.define("Hilo.month", { groupKeyFromDate: groupKeyFromDate });

})();