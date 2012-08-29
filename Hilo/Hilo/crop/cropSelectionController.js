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

    // Rubber Band Controller Constructor
    // ----------------------------------

    function CropSelectionControllerConstructor(cropSelection, canvasEl, cropSelectionEl) {
        this.canvas = canvasEl;
        this.cropSelectionEl = cropSelectionEl;
        this.cropSelection = cropSelection;

        this.reset();
        this.setupCorners();
    }

    // Rubber Band Controller Members
    // ------------------------------

    var cropSelectionControllerMembers = {

        reset: function () {
            this.boundingRect = this.canvas.getBoundingClientRect();
        },

        setupCorners: function () {
            var position = Hilo.Crop.CropSelectionCorner.position;

            this.addCorner("#topLeft", position.topLeft);
            this.addCorner("#topRight", position.topRight);
            this.addCorner("#bottomLeft", position.bottomLeft);
            this.addCorner("#bottomRight", position.bottomRight);
        },

        addCorner: function (selector, position) {
            if (!this.corners) { this.corners = {}; }

            var el = this.cropSelectionEl.querySelector(selector);
            var corner = new Hilo.Crop.CropSelectionCorner(window, el, position);
            this.corners[position] = corner;

            corner.addEventListener("start", this.startCornerMove.bind(this));
            corner.addEventListener("move", this.cornerMove.bind(this));
            corner.addEventListener("stop", this.stopCornerMove.bind(this));
        },

        startCornerMove: function (args) {
            this._currentCorner = args.detail.corner;
        },

        stopCornerMove: function () {
            delete this._currentCorner;
        },

        cornerMove: function (args) {
            var coords = args.detail.coords;
            var point = this.getCanvasPoint(coords);
            this.moveCropSelection(this._currentCorner, point);
        },

        moveCropSelection: function (cornerToMove, moveToPoint) {
            var coords = cornerToMove.getUpdatedCoords(moveToPoint);

            for (var attr in coords) {
                if (coords.hasOwnProperty(attr)) {
                    this.cropSelection[attr] = coords[attr];
                }
            }
        },

        getCanvasPoint: function (coords) {
            var rect = this.boundingRect;

            var x = (coords.x - rect.left);
            var y = (coords.y - rect.top);

            return {
                x: x,
                y: y
            };
        }

    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Crop", {
        CropSelectionController: WinJS.Class.mix(CropSelectionControllerConstructor, cropSelectionControllerMembers, WinJS.Utilities.eventMixin)
    });

})();