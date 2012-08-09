(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;

    // These settings must correspond to the height and width values specified 
    // in the css for the items. They need to be the greatest common demoninator
    // of the various widths and heights.
    var listViewLayoutSettings = {
        enableCellSpanning: true,
        cellWidth: 200,
        cellHeight: 200
    };

    // List View Controller Constructor
    // --------------------------------

    // The list view controller manages the contents and interactions of
    // the Hub page's list view. It listens to events from the 
    // [WinJS.UI.ListView][1] control and determines what to do based on
    // the specific event. 
    //
    // The ListViewController takes 2 parameters:
    //
    // 1. `el` - the DOM element for the `WinJS.UI.ListView` to control
    // 2. `appView` - a reference to [Windows.UI.ViewManagement.ApplicationView][2]
    //
    // This object requires a collaborator that can listen to the events that 
    // it triggers. The collaborator (in this case, the `Hilo.Hub.HubViewController`)
    // determines how other parts of the page will behave based on the events raised 
    // by this controller.
    //
    // [1]: http://msdn.microsoft.com/en-us/library/windows/apps/br211837.aspx
    // [2]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.ui.viewmanagement.applicationview
    //
    function ListViewController(el, appView) {
        this.el = el;
        this.lv = el.winControl;
        this.appView = appView;
        this.setup();
    }

    // List View Controller Methods
    // ----------------------------

    var listViewControllerMethods = {

        // Set up the default layout for the view, and set up the
        // event handlers from the ListView control.
        setup: function () {
            this.lv.layout = this.selectLayout(this.appView.value);

            // The [ECMASCript5 `bind`][3] function is used to ensure that the
            // context (the `this` variable) of the callback functions is set correctly.
            // Otherwise, the callback functions would not resolve `this` correctly 
            // when the events are raised and the callbacks are executed.
            // 
            // [3]: http://msdn.microsoft.com/en-us/library/windows/apps/ff841995
            //
            this.lv.addEventListener('iteminvoked', this.imageNavigated.bind(this));
            this.lv.addEventListener('selectionchanged', this.imageSelected.bind(this));
        },

        // Event handler for selecting an image
        imageSelected: function (args) {
            var itemIndex = this.getIndices();
            var hasItemSelected = itemIndex.length > 0;
            this.dispatchEvent("selectionChanged", {hasItemSelected: hasItemSelected });
        },

        // Event handler for "invoking" (clicking or tapping) an image
        imageNavigated: function (args) {
            var that = this;
            args.detail.itemPromise.then(function (item) {
                that.dispatchEvent("itemInvoked", {
                    item: item,
                    itemIndex: args.detail.itemIndex
                });
            });
        },

        // Bind an array of objects to the `ListView` by converting
        // it in to a bindable list, and data source.
        setDataSource: function (items) {
            this.lv.itemDataSource = new WinJS.Binding.List(items).dataSource;
        },

        // Change the layout of the list view based on the application's
        // [application view state][4]. 
        // 
        // [4]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.ui.viewmanagement.applicationviewstate
        setViewState: function (viewState) {
            this.lv.layout = this.selectLayout(viewState);
        },

        // Determines the correct layout for the screen based
        // on the current view state and last view state. If the
        // current view state is the same as the last view state,
        // no changes are made to the layout.
        selectLayout: function (viewState, lastViewState) {

            if (lastViewState === viewState) { return; }

            if (viewState === appViewState.snapped) {
                return new WinJS.UI.ListLayout();
            }
            else {
                var layout = new WinJS.UI.GridLayout();
                layout.groupInfo = function () { return listViewLayoutSettings; };
                layout.maxRows = 3;
                return layout;
            }
        },

        // Get the indices of the selected items from the ListView
        getIndices: function () {
            return this.lv.selection.getIndices();
        }
    };

    // Public API
    // ----------   

    WinJS.Namespace.define("Hilo.Hub", {
        ListViewController: WinJS.Class.mix(ListViewController, listViewControllerMethods, WinJS.Utilities.eventMixin)
    });

})();