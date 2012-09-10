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
    var maxImageCount = 6;

    // Hub View Controller Constructor
    // -------------------------------

    // The Hub view controller is an implementation of [the mediator pattern][1],
    // designed to coordinate multiple components of an individual page to
    // facilitate all of the functionality of that page. 
    //
    // The HubViewController requires 4 parameters for the constructor function:
    //
    // 1. `nav` - the `WinJS.Navigation` object, used to navigate to other pages
    // 2. `imageNav` - an instance of `Hilo.Controls.ImageNav.ImageNavController`
    // 3. `listView` - an instance of `Hilo.Hub.ListViewController`
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
    function HubViewControllerConstructor(nav, imageNav, listview, queryBuilder) {
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

    // Hub View Controller Methods
    // ---------------------------

    var hubViewControllerMembers = {

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

        loadImages: function () {
            var query = this.queryBuilder.build(this.folder);

            return query.execute()
                .then(this.bindImages)
                .then(this.animateEnterPage);
        },

        bindImages: function (items) {

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
        // ImageNavController to show and hide it appropriately.
        selectionChanged: function (args) {

            if (args.detail.hasItemSelected) {

                var picture = args.detail.item;
                var indexInGroup = picture.groupIndex;

                // If someone an image is selected, show the image nav
                // app bar with the "crop" and "rotate" buttons
                this.imageNav.setImageIndex(indexInGroup, true);

                // build the query for the selected item
                var query = this.buildQueryForPicture(picture);
                this.imageNav.setQueryForSelection(query);
            } else {
                // If no images are selected, hide the app bar
                this.imageNav.clearImageIndex(true);
                this.imageNav.clearQuery();
            }

        },

        // When an item is "invoked" (clicked or tapped), navigate to
        // the detail screen to display this image in the month-group
        // that it belongs to, based on the "ItemDate" of the picture.
        itemClicked: function (args) {

            // get the `Hilo.Picture` item that was bound to the invoked image,
            // and the item index from the list view
            var picture = args.detail.item.data;
            var indexInGroup = picture.groupIndex;

            // build the query that can find this picture within it's month group
            var query = this.buildQueryForPicture(picture);

            // Navigate to the detail view, specifying the month query to
            // show, and the index of the individual item that was invoked
            this.nav.navigate("/Hilo/detail/detail.html", { itemIndex: indexInGroup, query: query });
        },

        buildQueryForPicture: function(picture){
            // Build various parameters to determine the image
            // index and the month and year it was taken.
            // TODO: get the actual item index based on the query that is built
            var itemIndex = picture.groupIndex;
            var dateTaken = picture.itemDate;
            // TODO: Perhaps we can pass the `getMonthYearFrom` as a dependency?
            var monthAndYear = Hilo.dateFormatter.getMonthYearFrom(picture.itemDate);

            // Build the query for the month and year of the invoked image
            var query = this.queryBuilder
                .bindable()
                .forMonthAndYear(monthAndYear)
                .build(knownFolders.picturesLibrary);

            query.expectedName = picture.name;

            return query;
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        HubViewController: WinJS.Class.define(HubViewControllerConstructor, hubViewControllerMembers)
    });

})();
