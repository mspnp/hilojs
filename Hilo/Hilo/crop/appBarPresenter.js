(function () {
    "use strict";

    // AppBar Presenter Constructor
    // --------------------------

    function AppBarPresenterConstructor(el) {
        this.el = el;
        this.menu = el.winControl;

        this.setupButtons();
        this.menu.show();
    }

    // AppBar Presenter Members
    // ----------------------

    var appBarPresenterMembers = {
        setupButtons: function () {
            this.addButtonHandler("#save", this.saveClicked.bind(this));
            this.addButtonHandler("#reset", this.cancelClicked.bind(this));
            this.addButtonHandler("#unSnap", this.unSnapClicked.bind(this));
        },

        addButtonHandler: function (selector, handler) {
            var button = this.el.querySelector(selector);
            button.addEventListener("click", handler);
        },

        unSnapClicked: function () {
            this.dispatchEvent("unsnap", {});
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
