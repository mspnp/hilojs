// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var rotateClockwiseInDegrees = 90,
        rotateCounterClockwiseInDegrees = -90,
        rotateDefaultInDegrees = 0;

    // Appbar Presenter Constructor
    // ----------------------------

    function AppBarPresenter(el) {
        this.el = el;
        this.menu = el.winControl;

        this.setupButtons();
        this.menu.show();
    }

    // Appbar Presenter Members
    // ------------------------

    var appBarPresenterMembers = {

        // Set up all of the button click handlers and initially disable save / cancel
        setupButtons: function () {
            this.clockwiseButton = this._addButton("#clockwise", this.rotateClockwise.bind(this));
            this.saveButton = this._addButton("#save", this.saveChanges.bind(this));
            this.cancelButton = this._addButton("#cancel", this.cancelChanges.bind(this));
            this.unSnapButton = this._addButton("#unSnap", this.unSnap.bind(this));
            this._disableButtons();
        },

        // Unsnap the view, back in to full screen mode
        unSnap: function () {
            this.dispatchEvent("unsnap", {});
        },

        // Rotate clockwise was clicked
        rotateClockwise: function (args) {
            this._enableButtons();

            this.dispatchEvent("rotate", {
                rotateDegrees: rotateClockwiseInDegrees
            });
        },

        // Save was clicked
        saveChanges: function () {
            this._disableButtons();
            this.dispatchEvent("save", {});
        },

        // Cancel was clicked
        cancelChanges: function () {
            this._disableButtons();
            this.dispatchEvent("cancel", {});
        },

        // Internal method.
        // Builds a reference to a button using the specified query selector, and attaches
        // the clickHandler callback to the click event of the button.
        _addButton: function (selector, clickHandler) {
            var buttonEl = this.el.querySelector(selector).winControl;
            buttonEl.addEventListener("click", clickHandler);
            return buttonEl;
        },

        // Internal method.
        // Enables the save and cancel buttons
        _enableButtons: function () {
            this.saveButton.disabled = false;
        },

        // Internal method.
        // Disables the save and cancel buttons
        _disableButtons: function () {
            this.saveButton.disabled = true;
        }
    };

    // Appbar Presenter Definition
    // ---------------------------

    WinJS.Namespace.define("Hilo.Rotate", {
        AppBarPresenter: WinJS.Class.mix(AppBarPresenter, appBarPresenterMembers, WinJS.Utilities.eventMixin)
    });

})();