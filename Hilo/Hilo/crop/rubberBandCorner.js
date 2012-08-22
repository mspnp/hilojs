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

    // RubberBand Corner Constructor
    // -----------------------------

    function RubberBandCornerConstructor(el, position) {
        this.el = el;
        this.position = position;

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);

        this.listenToMouseDown();
    }

    // RubberBand Corner Type Members
    // ------------------------------

    var rubberBandCornerTypeMembers = {
        position: {
            topLeft: 0,
            topRight: 1,
            bottomLeft: 2,
            bottomRight: 3
        }
    };

    // RubberBand Corner Members
    // -------------------------

    var rubberBandCornerMembers = {
        listenToMouseDown: function () {
            this.el.addEventListener("mousedown", this.mouseDown);
        },

        ignoreMouseDown: function () {
            this.el.removeEventListener("mousedown", this.mouseDown);
        },

        listenToMouseUp: function () {
            window.addEventListener("mouseup", this.mouseUp);
        },

        ignoreMouseUp: function () {
            window.removeEventListener("mouseup", this.mouseUp);
        },

        mouseDown: function (e) {
            e.preventDefault();

            this.ignoreMouseDown();
            this.listenToMouseUp();

            this.dispatchEvent("start", {
                corner: this
            });
        },

        mouseUp: function (e) {
            e.preventDefault();

            this.ignoreMouseUp();
            this.listenToMouseDown();

            this.dispatchEvent("stop");
        },

        getUpdatedCoords: function (point) {
            var coords = {};

            switch (this.position) {
                case (rubberBandCornerTypeMembers.position.topLeft): {
                    coords.startX = point.x;
                    coords.startY = point.y;
                    break;
                }
                case (rubberBandCornerTypeMembers.position.topRight): {
                    coords.endX = point.x
                    coords.startY = point.y;
                    break;
                }
                case (rubberBandCornerTypeMembers.position.bottomLeft): {
                    coords.startX = point.x
                    coords.endY = point.y
                    break;
                }
                case (rubberBandCornerTypeMembers.position.bottomRight): {
                    coords.endX = point.x
                    coords.endY = point.y;
                    break;
                }
            }

            return coords;
        }
    };

    // RubberBand Corner Type Definition
    // ---------------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        RubberBandCorner: WinJS.Class.mix(
            WinJS.Class.define(RubberBandCornerConstructor, rubberBandCornerMembers, rubberBandCornerTypeMembers),
            WinJS.Utilities.eventMixin
        )
    });

})();