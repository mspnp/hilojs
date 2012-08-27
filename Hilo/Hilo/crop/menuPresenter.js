(function () {
    "use strict";

    // Menu Presenter Constructor
    // --------------------------

    function MenuPresenterConstructor(el) {
        this.el = el;
        this.setupButtons();
    }

    // Menu Presenter Members
    // ----------------------

    var menuPresenterMembers = {
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

    // Menu Presenter Definition
    // -------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        MenuPresenter: WinJS.Class.mix(MenuPresenterConstructor, menuPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();