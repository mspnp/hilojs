(function () {
    'use strict';

    // Private Methods
    // ---------------

    function HubViewCoordinator(nav, appbar, listview, repo) {
        this.nav = nav;
        this.listview = listview;
        this.appbar = appbar;
        this.repo = repo;
    };

    var hubViewMethods = {
        start: function(){
            this.appbar.addEventListener('rotate', this.rotateClicked.bind(this));
            this.appbar.addEventListener('crop', this.cropClicked.bind(this));

            this.listview.addEventListener('selectionChanged', this.selectionChanged.bind(this));
            this.listview.addEventListener('itemInvoked', this.itemClicked.bind(this));
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
            if (args.detail.hasItemSelected) {
                this.appbar.show();
                this.appbar.enableButtons();
            } else {
                this.appbar.hide();
                this.appbar.disableButtons();
            }
        },

        itemClicked: function (args) {
            var monthNames = ['January','February','March','April','May','June', 'July', 'August','September','October','November','December'];
            var itemIndex = args.detail.itemIndex;
            var picture = args.detail.item.data;
            var dateTaken = picture.dateTaken;
            var monthAndYear = monthNames[dateTaken.getMonth()] + ' ' + dateTaken.getFullYear();
            var query = this.repo.getQueryForMonthAndYear(monthAndYear);
            this.nav.navigate('/Hilo/detail/detail.html', { itemIndex: itemIndex, query: query });
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Hub', {
        HubViewCoordinator: WinJS.Class.define(HubViewCoordinator, hubViewMethods)
    });

})();