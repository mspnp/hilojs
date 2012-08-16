(function () {
    "use strict";

    // Constructor Function
    // --------------------

    // The `ImageNavController` requires two parameters:
    //
    // 1. `el`: the HTML element of the control
    // 2. `nav`: the WinJS.Navigation object
    function ImageNavController(el, nav, query) {
        this.el = el;
        this.appbar = el.winControl;
        this.nav = nav;
        this.query = query;

        this.setupButtons();
    }

    // Methods
    // -------
   
    var imageNavControllerMethods = {

        // Find the "crop" and "rotate" buttons and set up click handlers on them
        setupButtons: function () {
            this.rotate = this.el.querySelector("#rotate");
            this.rotate.addEventListener("click", this._rotateClicked.bind(this));

            this.crop = this.el.querySelector("#crop");
            this.crop.addEventListener("click", this._cropClicked.bind(this));
        },

        // Internal method. Handles the `click` event of the "#rotate" HTML element
        // and calls the navigation to go to the rotate page.
        _rotateClicked: function () {
        	this.nav.navigate("/Hilo/rotate/rotate.html", {
        		itemIndex: this.selectedImageIndex,
        		query: this.query
        	});
        },

        // Internal method. Handles the `click` event of the "#crop" HTML element
        // and calls the navigation to go to the crop page.
        _cropClicked: function () {
        	this.nav.navigate("/Hilo/crop/crop.html", {
        		itemIndex: this.selectedImageIndex,
        		query: this.query
        	});
        },

        // Set the currently selected image index. This tells the ImageNav control
        // to enable the buttons and show the app bar. 
        //
        // Call this method when an item from a ListView has been invoked or selected,
        // or when the current index of a FlipView is updated.
        //
        // ```js
        // listView.on("iteminvoked", function(){
        //   var indices = listView.getIndices();
        //   var itemIndex = indices[0];
        //   imageNavController.setImageIndex(itemIndex);
        // });
        // ```
        setImageIndex: function (itemIndex) {
            this.selectedImageIndex = itemIndex;
            this.appbar.show();
            this.enableButtons();
        },

        // Clear the currently selected image index. This tells the ImageNav control
        // to disable the buttons and hide the app bar.
        //
        // Call this method when the last item from a ListView has been de-selected.
        //
        // ```js
        // listView.on("selectionchanged", function(){
        //   var indices = listView.getIndices();
        //   if (indices.length === 0){
        //     imageNavController.clearImageIndex();
        //   }
        // });
        // ```
        clearImageIndex: function () {
            this.selectedImageIndex = -1;
            this.appbar.hide();
            this.disableButtons();
        },

        // Enable the buttons on the app bar. This method can be called when the
        // app bar is intended to always be shown on the screen, in order to always
        // enable the buttons. It would be preferable to use the `setImageIndex` 
        // method, though.
        enableButtons: function () {
            this.rotate.winControl.disabled = false;
            this.crop.winControl.disabled = false;
        },

        // Disable the buttons on the app bar. This method can be called when the
        // buttons on the app bar need to be disabled, regardless of the state of
        // the app bar.
        disableButtons: function () {
            this.rotate.winControl.disabled = true;
            this.crop.winControl.disabled = true;
        }
    };

    // Public API
    // ----------

    // Export `Hilo.Controls.ImageNav.ImageNavController` as a type that can be
    // instantiated and used to control the `ImageNav` PageControl.
    //
    // The `ImageNavController` includes the `WinJS.Utilities.eventMixin` to provide
    // standard event methods, including `addEventListener` and `dispatchEvent`. See
    // [the eventMixin documentation][1] and the article on [Adding functionality with 
    // WinJS mixins][2] for more information.
    //
    // [1]: http://msdn.microsoft.com/en-us/library/windows/apps/br211693.aspx
    // [2]: http://msdn.microsoft.com/en-us/library/windows/apps/hh967789.aspx

    WinJS.Namespace.define("Hilo.Controls.ImageNav", {
        ImageNavController: WinJS.Class.mix(ImageNavController, imageNavControllerMethods, WinJS.Utilities.eventMixin)
    });
})();