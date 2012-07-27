(function () {
    'use strict';

    // Private Methods
    // ---------------

    function AppBarController(el) {
        this.el = el;
        this.appbar = el.winControl;
        this.setup();
    }
   
    var controllerMethods = {
        setup: function () {
            var that = this;
            var buttons = this.el.querySelectorAll("button");
            Array.prototype.forEach.call(buttons, function (x) {
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
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        AppBarController: WinJS.Class.define(AppBarController, controllerMethods)
    });
})();