(function () {
    "use strict";

    // AppBar Presenter Constructor
    // --------------------------

    function AppBarPresenterConstructor(el) {
        this.el = el;
        this.setupButtons();
    }

    // AppBar Presenter Members
    // ----------------------

    var appBarPresenterMembers = {
        setupButtons: function () {
            this.addButtonHandler("#crop", this.cropClicked.bind(this));
            this.addButtonHandler("#save", this.saveClicked.bind(this));
            this.addButtonHandler("#cancel", this.cancelClicked.bind(this));
        },

        addButtonHandler: function(selector, handler){
            var button = this.el.querySelector(selector);
            button.addEventListener("click", handler);
        },

        cropClicked: function (e) {
            e.preventDefault();
            this.dispatchEvent("crop", {});
        },

        saveClicked: function (e) {
            e.preventDefault();
            this.dispatchEvent("save", {});
        },

        cancelClicked: function (e) {
            e.preventDefault();
            this.dispatchEvent("cancel", {});
        }
    };

    // AppBar Presenter Definition
    // -------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        AppBarPresenter: WinJS.Class.mix(AppBarPresenterConstructor, appBarPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();