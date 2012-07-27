(function () {
    'use strict';

    // Private Methods
    // ---------------

    function AppBarController(el) {
        this.el = el;
        this.appbar = el.winControl;
        this.buttons = this.el.querySelectorAll("button");

        this.setupButtonClicks();
    }
   
    var controllerMethods = {
        setupButtonClicks: function () {
            var that = this;
            Array.prototype.forEach.call(this.buttons, function (x) {
                x.addEventListener('click', function (args) {
                    WinJS.Application.queueEvent({ type: "appbar:" + args.currentTarget.id });
                });
            });
        },

        show: function () {
            this.appbar.show();
        },

        hide: function () {
            this.appbar.hide();
        },

        enableButtons: function () {
            Array.prototype.forEach.call(this.buttons, function (x) {
                x.winControl.disabled = false;
            });
        },

        disableButtons: function () {
            Array.prototype.forEach.call(this.buttons, function (x) {
                x.winControl.disabled = true;
            });
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        AppBarController: WinJS.Class.define(AppBarController, controllerMethods)
    });
})();