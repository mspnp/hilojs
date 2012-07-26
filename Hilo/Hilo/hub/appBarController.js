(function () {
    'use strict';

    // Private Methods
    // ---------------

    function AppBarController(el) {
        this.el = el;
        this.appbar = el.winControl;
        this.buttons = el.querySelector("button");
    }

    var controllerMethods = {
        setup: function () {
            var that = this;
            Array.prototype.forEach.call(this.buttons, function (x) {
                x.addEventListener('click', function (args) {
                    WinJS.Application.queueEvent("appbar:" + args.currentTarget.id);
                });
            });
        },

        show: function () {
            this.appbar.show();
        },

        hide: function () {
            this.appbar.hide();
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        AppBarController: WinJS.Class.define(AppBarController, controllerMethods)
    });
})();