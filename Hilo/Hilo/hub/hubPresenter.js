// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var knownFolders = Windows.Storage.KnownFolders;
    // The maximum number of images to display on the hub page 
    var maxImageCount = 6;

    // Hub Presenter Constructor
    // -------------------------------

    // The Hub presenter is an implementation of [the mediator pattern][1],
    // designed to coordinate multiple components of an individual page to
    // facilitate all of the functionality of that page. 
    //
    // The HubViewPresenter requires 4 parameters for the constructor function:
    //
    // 1. `nav` - the `WinJS.Navigation` object, used to navigate to other pages
    // 2. `hiloAppBar` - an instance of `Hilo.Controls.HiloAppBar.HiloAppBarPresenter`
    // 3. `listView` - an instance of `Hilo.Hub.ListViewPresenter`
    // 4. `queryBuilder` - an instance of `Hilo.ImageQueryBuilder`
    // 
    // Each individual component of the page is focused on one specific set 
    // of behaviors - both visually and in code. This creates a very clean
    // separation of concerns for each functional area of the screen. The 
    // mediator, then, brings all of the functionality of each component 
    // together. It listens to events from one component and determines what 
    // to do with the other components in response. 
    //
    // [1]: http://en.wikipedia.org/wiki/Mediator_pattern
    //
    function HubPresenterConstructor(nav, hiloAppBar, listview, queryBuilder) {
        this.nav = nav;
        this.hiloAppBar = hiloAppBar;
        this.listview = listview;
        this.queryBuilder = queryBuilder;

        // The [ECMASCript5 `bind`][2] function is used to ensure that the
        // context (the `this` variable) of each of the specified
        // callback functions is set correctly, when the event triggers
        // and the callback is executed.
        // 
        // [2]: http://msdn.microsoft.com/en-us/library/windows/apps/ff841995
        //
        this.loadImages = this.loadImages.bind(this);
        this.bindImages = this.bindImages.bind(this);
        this.selectionChanged = this.selectionChanged.bind(this);
        this.itemClicked = this.itemClicked.bind(this);
        this.displayLibraryEmpty = this.displayLibraryEmpty.bind(this);
    };

    // Hub Presenter Methods
    // ---------------------------

    var hubPresenterMembers = {

        // Starts processing the events from individual components, to 
        // facilitate the functionality of the other components.
        start: function (folder) {

            this.folder = folder;

            this.listview.addEventListener("selectionChanged", this.selectionChanged);
            this.listview.addEventListener("itemInvoked", this.itemClicked);

            // Configure and then build the query for this page
            // <SnippetHilojs_1301>
            this.queryBuilder
                .bindable(true)
                .prefetchOptions(["System.ItemDate"])
                .count(maxImageCount);
            // </SnippetHilojs_1301>

            // Retrieve and display the images
            return this.loadImages();
        },

        dispose: function () {
            if (this.dataSource) {
                this.dataSource.forEach(function (img) {
                    img.dispose();
                });
            }
        },

        loadImages: function () {
            var self = this;

            // <SnippetHilojs_1309>
            var query = this.queryBuilder.build(this.folder);
            // </SnippetHilojs_1309>

            // <SnippetHilojs_1313>
            return query.execute()
                .then(function (items) {
                    if (items.length === 0) {
                        self.displayLibraryEmpty();
                    } else {
                        self.bindImages(items);
                        self.animateEnterPage();
                    }
                });
            // </SnippetHilojs_1313>
        },

        // <SnippetHilojs_1315>
        bindImages: function (items) {
            this.dataSource = items;

            if (items.length > 0) {
                items[0].className = items[0].className + " first";
            }

            // We need to know the index of the image with respect to
            // to the group (month/year) so that we can select it
            // when we navigate to the detail page.
            var lastGroup = "";
            var indexInGroup = 0;
            items.forEach(function (item) {
                var group = item.itemDate.getMonth() + " " + item.itemDate.getFullYear();
                if (group !== lastGroup) {
                    lastGroup = group;
                    indexInGroup = 0;
                }

                item.groupIndex = indexInGroup;
                indexInGroup++;
            });

            this.listview.setDataSource(items);
        },
        // </SnippetHilojs_1315>

        displayLibraryEmpty: function () {
            this.hiloAppBar.disableButtons();
            this.listview.hide();

            document.querySelector("#navigateToMonth").style.display = "none";
            document.querySelector(".empty-library").style.display = "block";
        },

        animateEnterPage: function () {
            var elements = document.querySelectorAll(".titlearea, section[role=main]");
            WinJS.UI.Animation.enterPage(elements);
        },

        // The callback method for item selection in the listview changing.
        // This function coordinates the selection changes with the 
        // HiloAppBarPresenter to show and hide it appropriately.
        selectionChanged: function (args) {

            if (args.detail.hasItemSelected) {

                var picture = args.detail.item;

                // build the query for the selected item
                var options = this.buildQueryForPicture(picture);

                // If an image is selected, show the image nav
                // app bar with the "crop" and "rotate" buttons
                this.hiloAppBar.setNavigationOptions(options, true);

            } else {
                // If no images are selected, hide the app bar
                this.hiloAppBar.clearNavigationOptions(true);
            }
        },

        // When an item is "invoked" (clicked or tapped), navigate to
        // the detail screen to display this image in the month-group
        // that it belongs to, based on the "ItemDate" of the picture.
        // <SnippetHilojs_1402>
        itemClicked: function (args) {

            // get the `Hilo.Picture` item that was bound to the invoked image,
            // and the item index from the list view
            var picture = args.detail.item.data;

            // build the query that can find this picture within it's month group
            var options = this.buildQueryForPicture(picture);

            // Navigate to the detail view, specifying the month query to
            // show, and the index of the individual item that was invoked
            this.nav.navigate("/Hilo/detail/detail.html", options);
        },
        // </SnippetHilojs_1402>

        buildQueryForPicture: function (picture) {

            // Build the query for the month and year of the invoked image
            var query = this.queryBuilder
                .bindable(true)
                .forMonthAndYear(picture.itemDate)
                .build(knownFolders.picturesLibrary);

            return {
                query: query,
                itemIndex: picture.groupIndex,
                itemName: picture.name
            };
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        HubViewPresenter: WinJS.Class.define(HubPresenterConstructor, hubPresenterMembers)
    });

})();
