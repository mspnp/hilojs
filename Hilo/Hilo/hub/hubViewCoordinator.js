(function () {
    'use strict';

    // Private Methods
    // ---------------

    function HubViewCoordinator(app, nav, appbar, listview) {
        this.nav = nav;
        this.app = app;
        this.listview = listview;
        this.appbar = appbar;
    };

    var hubViewMethods = {
        start: function(){
            this.app.addEventListener("appbar:rotate", this.rotateClicked.bind(this));
            this.app.addEventListener("appbar:crop", this.cropClicked.bind(this));

            this.app.addEventListener("listview:selectionChanged", this.selectionChanged.bind(this));
            this.app.addEventListener("listview:itemInvoked", this.itemClicked.bind(this));
        },

        rotateClicked: function () {
            var indices = this.listview.getIndices();
            this.nav.navigate('/Hilo/rotate/rotate.html', indices[0]);
        },

        cropClicked: function () {
            var indices = this.listview.getIndices();
            this.nav.navigate('/Hilo/crop/crop.html', indices[0]);
        },

        selectionChanged: function (args) {
            if (args.hasItemSelected) {
                this.appbar.show();
                this.appbar.enableButtons();
            } else {
                this.appbar.hide();
                this.appbar.disableButtons();
            }
        },

        itemClicked: function (args) {
            this.nav.navigate('/Hilo/detail/detail.html', args.itemIndex);
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        HubViewCoordinator: WinJS.Class.define(HubViewCoordinator, hubViewMethods)
    });

})();