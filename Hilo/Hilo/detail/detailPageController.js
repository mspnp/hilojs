(function () {
    'use strict';

    // Private Methods
    // ---------------

    function DetailPageController(flipview, filmstrip) {
        this.flipview = flipview;
        this.filmstrip = filmstrip;
    }

    var detailPageController = {
        run: function () {
            this.filmstrip.addEventListener("imageInvoked", this.imageClicked.bind(this));
        },

        imageClicked: function (args) {
            this.flipview.showImageAt(args.detail.itemIndex);
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        DetailPageController: WinJS.Class.mix(DetailPageController, detailPageController, WinJS.Utilities.eventMixin)
    });
})();