(function () {
    'use strict';

    // Private Methods
    // ---------------

    function FlipviewController(el) {
        this.el = el;
        this.winControl = el.winControl;
    }

    var flipviewController = {
        showImageAt: function (index) {
            this.winControl.currentPage = index;
        }
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        FlipviewController: WinJS.Class.mix(FlipviewController, flipviewController, WinJS.Utilities.eventMixin)
    });

})();