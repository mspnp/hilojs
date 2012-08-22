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

    function RubberBandConstructor(canvasEl) {
        var boundingRect = canvasEl.getBoundingClientRect();

        this.addProp("startX", 0);
        this.addProp("startY", 0);
        this.addProp("endX", boundingRect.width);
        this.addProp("endY", boundingRect.height);
    }

    // RubberBand Members
    // ------------------

    var rubberBandMembers = {

        addProp: function (propName, initialValue) {
            var that = this;
            var propertyValue = initialValue;

            Object.defineProperty(this, propName, {
                get: function () {
                    return propertyValue;
                },
                set: function (value) {
                    propertyValue = value;
                    that.dispatchMove();
                }
            });
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