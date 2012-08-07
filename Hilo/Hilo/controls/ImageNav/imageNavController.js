(function () {
    'use strict';

    // Private Methods
    // ---------------

    function ImageNavController(el) {
        this.el = el;
        this.appbar = el.winControl;
        this.buttons = this.el.querySelectorAll("button");

        this.setupButtonClicks();
    }
   
    var imageNavControllerMethods = {
        setupButtonClicks: function () {
            var that = this;
            Array.prototype.forEach.call(this.buttons, function (x) {
                x.addEventListener('click', function (args) {
                    that.dispatchEvent(args.currentTarget.id);
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

    WinJS.Namespace.define("Hilo.Controls.ImageNav", {
        ImageNavController: WinJS.Class.mix(ImageNavController, imageNavControllerMethods, WinJS.Utilities.eventMixin)
    });
})();