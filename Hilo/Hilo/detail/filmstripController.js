(function () {
    'use strict';

    // Imports And Constants
    // ---------------------

    // Private Methods
    // ---------------

    function FilmstripController(el) {
        this.el = el;
        this.winControl = el.winControl;
        this.setupControlHandlers();
    }

    var filmstripController = {
        setupControlHandlers: function () {
            this.winControl.addEventListener("iteminvoked", this.itemClicked.bind(this));
        },

        getSelectedIndices: function(){
            return this.winControl.selection.getIndices();
        },

        itemClicked: function () {
            var indices = this.getSelectedIndices();
            this.dispatchEvent("imageInvoked", {
                itemIndex: indices[0]
            });
        }
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        FilmstripController: WinJS.Class.mix(FilmstripController, filmstripController, WinJS.Utilities.eventMixin)
    });

})();