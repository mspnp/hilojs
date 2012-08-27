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

    // RubberBand Constructor
    // ----------------------

    function RubberBandConstructor(canvasSize) {
        this.canvasSize = canvasSize;

        this.addProp("startX", 0);
        this.addProp("startY", 0);
        this.addProp("endX", canvasSize.width, this.adjustWidth.bind(this));
        this.addProp("endY", canvasSize.height, this.adjustHeight.bind(this));
    }

    // RubberBand Members
    // ------------------

    var rubberBandMembers = {

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

        adjustWidth: function (width) {
            return Math.min(width, this.canvasSize.width);
        },

        adjustHeight: function(height){
            return Math.min(height, this.canvasSize.height);
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
                endY: this.endY
            }
        }
    };

    // RubberBand Definition
    WinJS.Namespace.define("Hilo.Crop", {
        RubberBand: WinJS.Class.mix(
            WinJS.Class.define(RubberBandConstructor, rubberBandMembers),
            WinJS.Utilities.eventMixin
        )
    });

}());