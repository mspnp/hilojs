(function () {
    'use strict';

    // Constructor Function
    // --------------------

    function ImageNavController(el, nav) {
        this.el = el;
        this.appbar = el.winControl;
        this.nav = nav;

        this.setupButtons();
    }

    // Methods
    // -------
   
    var imageNavControllerMethods = {

        setupButtons: function () {
            this.rotate = this.el.querySelector("#rotate");
            this.rotate.addEventListener('click', this.rotateClicked.bind(this));

            this.crop = this.el.querySelector("#crop");
            this.crop.addEventListener('click', this.cropClicked.bind(this));
        },

        setImageIndex: function (itemIndex) {
            this.selectedImageIndex = itemIndex;
            this.appbar.show();
            this.enableButtons();
        },

        clearImageIndex: function () {
            this.selectedImageIndex = -1;
            this.appbar.hide();
            this.disableButtons();
        },

        enableButtons: function () {
            this.rotate.winControl.disabled = false;
            this.crop.winControl.disabled = false;
        },

        disableButtons: function () {
            this.rotate.winControl.disabled = true;
            this.crop.winControl.disabled = true;
        },

        rotateClicked: function () {
            this.nav.navigate('/Hilo/rotate/rotate.html', this.selectedImageIndex);
        },

        cropClicked: function () {
            this.nav.navigate('/Hilo/crop/crop.html', this.selectedImageIndex);
        },
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Controls.ImageNav", {
        ImageNavController: WinJS.Class.mix(ImageNavController, imageNavControllerMethods, WinJS.Utilities.eventMixin)
    });
})();