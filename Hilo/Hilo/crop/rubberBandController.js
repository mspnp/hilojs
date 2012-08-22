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

    var Corner = Hilo.Crop.RubberBandCorner;

    // Rubber Band Controller Constructor
    // ----------------------------------

    function RubberBandControllerConstructor(canvasEl, rubberBandEl) {
        this.canvas = canvasEl;
        this.rubberBand = rubberBandEl;

        this.boundingRect = this.canvas.getBoundingClientRect();
        this.corners = [];
        this.setupCorners();

        this.mouseMove = this.mouseMove.bind(this);
    }

    // Rubber Band Controller Members
    // ------------------------------

    var rubberBandControllerMembers = {

        setupCorners: function () {
            this.addCorner("#topLeft", Corner.position.topLeft);
            this.addCorner("#topRight", Corner.position.topRight);
            this.addCorner("#bottomLeft", Corner.position.bottomLeft);
            this.addCorner("#bottomRight", Corner.position.bottomRight);
        },

        addCorner: function (selector, position) {
            var el = this.rubberBand.querySelector(selector);
            var corner = new Corner(el, position);
            corner.addEventListener("start", this.startCornerMove.bind(this));
            corner.addEventListener("stop", this.stopCornerMove.bind(this));
        },

        start: function () {
            this.rubberBand.style.display = "block";

            this.rubberBandCoords = {
                startX: 0,
                startY: 0,
                endX: this.boundingRect.width,
                endY: this.boundingRect.height
            };

            this.dispatchMove();
        },

        startCornerMove: function (args) {
            this._currentCorner = args.detail.corner;
            window.addEventListener("mousemove", this.mouseMove);
        },

        stopCornerMove: function () {
            window.removeEventListener("mousemove", this.mouseMove);
            delete this._currentCorner;
        },

        mouseMove: function (e) {
            var point = this.getCanvasPoint(e.clientX, e.clientY);
            this.moveRubberBand(this._currentCorner, point);
        },

        moveRubberBand: function (cornerToMove, moveToPoint) {
            var coords = cornerToMove.getUpdatedCoords(moveToPoint);

            for (var attr in coords) {
                if (coords.hasOwnProperty(attr)) {
                    this.rubberBandCoords[attr] = coords[attr];
                }
            }
            
            this.dispatchMove();
        },

        dispatchMove: function(){
            this.dispatchEvent("move", {
                coords: this.rubberBandCoords
            });
        },

        getCanvasPoint: function (windowX, windowY) {
            var rect = this.boundingRect;

            var x = (windowX - rect.left);
            var y = (windowY - rect.top);

            return {
                x: x,
                y: y
            };
        }

    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Crop", {
        RubberBandController: WinJS.Class.mix(RubberBandControllerConstructor, rubberBandControllerMembers, WinJS.Utilities.eventMixin)
    });

})();