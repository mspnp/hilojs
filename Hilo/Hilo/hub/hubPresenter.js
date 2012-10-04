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

    var knownFolders = Windows.Storage.KnownFolders;
    // The maximum number of images to display on the hub page 
    var maxImageCount = 600;

    // Hub Presenter Constructor
    // -------------------------------

    // The Hub presenter is an implementation of [the mediator pattern][1],
    // designed to coordinate multiple components of an individual page to
    // facilitate all of the functionality of that page. 
    //
    // The HubViewPresenter requires 4 parameters for the constructor function:
    //
    // 1. `nav` - the `WinJS.Navigation` object, used to navigate to other pages
    // 2. `imageNav` - an instance of `Hilo.Controls.ImageNav.ImageNavPresenter`
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
    function HubPresenterConstructor(nav, imageNav, listview, queryBuilder) {
        this.nav = nav;
        this.imageNav = imageNav;
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
            this.queryBuilder
                .bindable()
                .prefetchOptions(["System.ItemDate"])
                .count(maxImageCount);

            // Retrieve and display the images
            return this.loadImages();
        },

        dispose: function () {
            this.dataSource.forEach(function (img) { img.dispose(); });
        },

        loadImages: function () {
            var query = this.queryBuilder.build(this.folder);

            return query.execute()
                .then(this.bindImages)
                .then(this.animateEnterPage);
        },

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

        animateEnterPage: function () {
            var elements = document.querySelectorAll(".titlearea, section[role=main]");
            WinJS.UI.Animation.enterPage(elements);
        },

        // The callback method for item selection in the listview changing.
        // This function coordinates the selection changes with the 
        // ImageNavPresenter to show and hide it appropriately.
        selectionChanged: function (args) {

            if (args.detail.hasItemSelected) {

                var picture = args.detail.item;

                // build the query for the selected item
                var options = this.buildQueryForPicture(picture);

                // If an image is selected, show the image nav
                // app bar with the "crop" and "rotate" buttons
                this.imageNav.setNavigationOptions(options, true);

            } else {
                // If no images are selected, hide the app bar
                this.imageNav.clearNavigationOptions(true);
            }
        },

        // When an item is "invoked" (clicked or tapped), navigate to
        // the detail screen to display this image in the month-group
        // that it belongs to, based on the "ItemDate" of the picture.
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

        buildQueryForPicture: function (picture) {

            // Build the query for the month and year of the invoked image
            var query = this.queryBuilder
                .bindable()
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
