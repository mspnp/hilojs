(function () {
    'use strict';

    // Private Methods
    // ---------------

    function HubViewCoordinator(nav, imageNav, listview, queryBuilder) {
        this.nav = nav;
        this.imageNav = imageNav;
        this.listview = listview;
        this.queryBuilder = queryBuilder
    };

    var hubViewMethods = {
        start: function(){
            this.listview.addEventListener('selectionChanged', this.selectionChanged.bind(this));
            this.listview.addEventListener('itemInvoked', this.itemClicked.bind(this));
        },

        selectionChanged: function (args) {
            if (args.detail.hasItemSelected) {
                this.imageNav.setImageIndex(args.detail.itemIndex);
            } else {
                this.imageNav.clearImageIndex();
            }
        },

        itemClicked: function (args) {
            var monthNames = ['January','February','March','April','May','June', 'July', 'August','September','October','November','December'];
            var picture = args.detail.item.data;
            var itemIndex = picture.groupIndex;
            var dateTaken = picture.itemDate;
            var monthAndYear = monthNames[dateTaken.getMonth()] + ' ' + dateTaken.getFullYear();

            this.queryBuilder
                .bindable()
                .forMonthAndYear(monthAndYear);

            var query = this.queryBuilder.build();
            this.nav.navigate('/Hilo/detail/detail.html', { itemIndex: itemIndex, query: query });
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define('Hilo.Hub', {
        HubViewCoordinator: WinJS.Class.define(HubViewCoordinator, hubViewMethods)
    });

})();