// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var storage = Windows.Storage,
    promise = WinJS.Promise,
    thumbnailMode = storage.FileProperties.ThumbnailMode.singleItem,
    knownFolders = Windows.Storage.KnownFolders;

    var myData = [
    { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Lavish Lemon Ice", text: "Sorbet", picture: "images/60Lemon.png" },
    { title: "Lavish Lemon Ice", text: "Sorbet", picture: "images/60Lemon.png" },
    { title: "Lavish Lemon Ice", text: "Sorbet", picture: "images/60Lemon.png" },
    { title: "Lavish Lemon Ice", text: "Sorbet", picture: "images/60Lemon.png" },
    { title: "Marvelous Mint", text: "Gelato", picture: "images/60Mint.png" },
    { title: "Marvelous Mint", text: "Gelato", picture: "images/60Mint.png" },
    { title: "Marvelous Mint", text: "Gelato", picture: "images/60Mint.png" },
    { title: "Marvelous Mint", text: "Gelato", picture: "images/60Mint.png" },
    { title: "Creamy Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Creamy Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Creamy Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Creamy Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Succulent Strawberry", text: "Sorbet", picture: "images/60Strawberry.png" },
    { title: "Succulent Strawberry", text: "Sorbet", picture: "images/60Strawberry.png" },
    { title: "Succulent Strawberry", text: "Sorbet", picture: "images/60Strawberry.png" },
    { title: "Succulent Strawberry", text: "Sorbet", picture: "images/60Strawberry.png" },
    { title: "Very Vanilla", text: "Ice Cream", picture: "images/60Vanilla.png" },
    { title: "Very Vanilla", text: "Ice Cream", picture: "images/60Vanilla.png" },
    { title: "Very Vanilla", text: "Ice Cream", picture: "images/60Vanilla.png" },
    { title: "Very Vanilla", text: "Ice Cream", picture: "images/60Vanilla.png" },
    { title: "Orangy Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Orangy Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Absolutely Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Absolutely Orange", text: "Sorbet", picture: "images/60Orange.png" },
    { title: "Triple Strawberry", text: "Sorbet", picture: "images/60Strawberry.png" },
    { title: "Triple Strawberry", text: "Sorbet", picture: "images/60Strawberry.png" },
    { title: "Double Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Double Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Double Banana Blast", text: "Low-fat frozen yogurt", picture: "images/60Banana.png" },
    { title: "Green Mint", text: "Gelato", picture: "images/60Mint.png" }
    ];

    // Create a WinJS.Binding.List from the array. 
    var itemsList = new WinJS.Binding.List(myData);

    // Sorts the groups
    function compareGroups(leftKey, rightKey) {
        return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
    }

    // Returns the group key that an item belongs to
    function getGroupKey(dataItem) {
        return dataItem.title.toUpperCase().charAt(0);
    }

    // Returns the title for a group
    function getGroupData(dataItem) {
        return {
            title: dataItem.title.toUpperCase().charAt(0)
        };
    }

    // Create the groups for the ListView from the item data and the grouping functions
    var groupedItemsList = itemsList.createGrouped(getGroupKey, getGroupData, compareGroups);

    function x() {
        var folder = knownFolders.picturesLibrary;
        var byMonth = storage.Search.CommonFolderQuery.groupByMonth;

        var queryOptions = new storage.Search.QueryOptions(byMonth);
        queryOptions.indexerOption = Windows.Storage.Search.IndexerOption.useIndexerWhenAvailable;

        var queryResult = folder.createFolderQueryWithOptions(queryOptions);

        var factory = new storage.BulkAccess.FileInformationFactory(queryResult, thumbnailMode);
        var sds = new WinJS.UI.StorageDataSource(queryResult, {
            mode: thumbnailMode,
            requestedThumbnailSize: 256,
            thumbnailOptions: storage.FileProperties.ThumbnailOptions.none,
            synchronous: true
        });

        var listview = document.querySelector('#monthgroup').winControl;
        listview.itemDataSource = groupedItemsList.dataSource;
        listview.groupDataSource = groupedItemsList.groups.dataSource;

        //return factory.getFoldersAsync().then(function (items) {
        //    return items[0].getFilesAsync().then(function (files) {
        //        debugger;
        //    });
        //});
    }

    WinJS.UI.Pages.define("/Hilo/month/month.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            x();
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            // TODO: Respond to changes in viewState.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    });
})();
