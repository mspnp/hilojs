(function () {
    'use strict';

    // Private Methods
    // ---------------

    function HubViewCoordinator (appbar, listview) {
        this.listview = listview;
        this.appbar = appbar;
    };

    var hubViewMethods = {
        start: function(){
            var app = WinJS.Application;

            app.addEventListener("appbar:rotate", this.rotateClicked.bind(this));
            app.addEventListener("appbar:crop", this.cropClicked.bind(this));
            app.addEventListener("listview:selectionChanged", this.selectionChanged.bind(this));
            app.addEventListener("listview:itemInvoked", this.itemClicked.bind(this));
        },

        rotateClicked: function () {
            var indices = this.listview.getIndices();
            WinJS.Navigation.navigate('/Hilo/rotate/rotate.html', indices[0]);
        },

        cropClicked: function () {
            var indices = this.listview.getIndices();
            WinJS.Navigation.navigate('/Hilo/crop/crop.html', indices[0]);
        },

        selectionChanged: function (args) {
            var buttons = document.querySelectorAll('#appbar button');
            Array.prototype.forEach.call(buttons, function (x) {
                x.winControl.disabled = !args.hasItemSelected;
            });

            if (args.hasItemSelected) {
                this.appbar.show();
            } else {
                this.appbar.hide();
            }
        },

        itemClicked: function (args) {
            WinJS.Navigation.navigate('/Hilo/detail/detail.html', args.itemIndex);
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        HubViewCoordinator: WinJS.Class.define(HubViewCoordinator, hubViewMethods)
    });

})();