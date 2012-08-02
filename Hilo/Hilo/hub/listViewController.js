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

    // Private Methods
    // ---------------

    function ListViewController(el, appView) {
        this.el = el;
        this.lv = el.winControl;
        this.appView = appView;
        this.setup();
    }

    var controllerMethods = {

        setup: function () {
            this.lv.layout = this.selectLayout(this.appView.value);

            this.lv.addEventListener('iteminvoked', this.imageNavigated.bind(this));
            this.lv.addEventListener('selectionchanged', this.imageSelected.bind(this));
        },

        setDataSource: function (items) {
            this.lv.itemDataSource = new WinJS.Binding.List(items).dataSource;
        },

        setViewState: function (viewState) {
            this.lv.layout = this.selectLayout(viewState);
        },

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

        getIndices: function () {
            return this.lv.selection.getIndices();
        },

        imageSelected: function (args) {
            var itemIndex = this.getIndices();
            var hasItemSelected = itemIndex.length > 0;
            this.dispatchEvent("selectionChanged", {hasItemSelected: hasItemSelected });
        },

        imageNavigated: function (args) {
            var that = this;
            args.detail.itemPromise.then(function (item) {
                that.dispatchEvent("itemInvoked", {
                    item: item,
                    itemIndex: args.detail.itemIndex
                });
            });
        }
    };

    // Public API
    // ----------

    var Klass = WinJS.Class.define(ListViewController, controllerMethods);
    Klass = WinJS.Class.mix(Klass, WinJS.Utilities.eventMixin);

    WinJS.Namespace.define("Hilo.Hub", {
        ListViewController: Klass
    });

})();