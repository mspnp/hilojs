// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var minHeight = 30,
        minWidth = 30;

    // CropSelection Constructor
    // -------------------------

    function CropSelectionConstructor() {
        this.addProp("startX", 0, this.adjustStartX.bind(this));
        this.addProp("startY", 0, this.adjustStartY.bind(this));
        this.addProp("endX", 0, this.adjustEndX.bind(this));
        this.addProp("endY", 0, this.adjustEndY.bind(this));
    }

    // CropSelection Members
    // ---------------------

    var cropSelectionMembers = {

        addProp: function (propName, initialValue, adjust) {
            var that = this;
            var propertyValue = initialValue;

            Object.defineProperty(this, propName, {
                get: function () {
                    return propertyValue;
                },
                set: function (value) {
                    if (adjust) { value = adjust(value); }
                    propertyValue = value;
                    that.dispatchMove();
                }
            });
        },

        adjustStartX: function (startX) {
            var min = Math.max(startX, 0);
            var max = Math.min(min, this.endX - minWidth);
            return Math.min(min, max);
        },

        adjustStartY: function (startY) {
            var min = Math.max(startY, 0);
            var max = Math.min(min, this.endY - minHeight);
            return Math.min(min, max);
        },

        adjustEndX: function (endX) {
            var min = Math.max(endX, this.startX + minWidth);
            var max = Math.min(min, this.canvasSize.width);
            return Math.min(min, max);
        },

        adjustEndY: function(endY){
            var min = Math.max(endY, this.startY + minHeight);
            var max = Math.min(min, this.canvasSize.height);
            return Math.min(min, max);
        },

        reset: function (canvasSize) {
            this.canvasSize = canvasSize;

            this.endX = this.canvasSize.width;
            this.endY = this.canvasSize.height;
            this.startX = 0;
            this.startY = 0;
        },

        dispatchMove: function () {
            this.dispatchEvent("move", {
                coords: this.getCoords()
            });
        },

        getCoords: function () {
            return {
                startX: this.startX,
                startY: this.startY,
                endX: this.endX,
                endY: this.endY,
                height: this.endY - this.startY,
                width: this.endX - this.startX
            }
        }
    };

    // CropSelection Definition
    // ------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CropSelection: WinJS.Class.mix(CropSelectionConstructor, cropSelectionMembers, WinJS.Utilities.eventMixin)
    });

}());