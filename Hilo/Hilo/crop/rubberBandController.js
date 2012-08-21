(function () {
    "use strict";

    // Corner Constructor
    // ------------------

    function CornerConstructor(el, position) {
        this.el = el;
        this.position = position;

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);

        this.setupEvents();
    }

    // Corner Type Members
    // -------------------

    var cornerTypeMembers = {
        position: {
            topLeft: 0,
            topRight: 1,
            bottomLeft: 2,
            bottomRight: 3
        }
    };

    // Corner Members
    // --------------

    var cornerMembers = {
        setupEvents: function () {
            this.el.addEventListener("mousedown", this.mouseDown);
        },

        mouseDown: function (e) {
            e.preventDefault();

            window.addEventListener("mouseup", this.mouseUp);
            this.el.removeEventListener("mousedown", this.mouseDown);

            this.dispatchEvent("start", {
                position: this.position
            });
        },

        mouseUp: function (e) {
            e.preventDefault();

            window.removeEventListener("mouseup", this.mouseUp);

            this.dispatchEvent("stop", {
                position: this.position
            });
        }
    };

    // Corner Type Definition
    // ----------------------

    var Corner = WinJS.Class.mix(
        WinJS.Class.define(CornerConstructor, cornerMembers, cornerTypeMembers),
        WinJS.Utilities.eventMixin
    );

    // Rubber Band Controller Constructor
    // ----------------------------------

    function RubberBandControllerConstructor(canvasEl, rubberBandEl) {
        this.canvas = canvasEl;
        this.boundingRect = canvasEl.getBoundingClientRect();
        this.rubberBand = rubberBandEl;

        this.corners = [];
        this.setupCorners();

        this.mouseMove = this.mouseMove.bind(this);
        this.startRubberBand();
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

        startCornerMove: function (args) {
            this._currentCorner = args.detail.position;
            window.addEventListener("mousemove", this.mouseMove);
        },

        stopCornerMove: function (args) {
            window.removeEventListener("mousemove", this.mouseMove);
            delete this._currentCorner;
        },

        mouseMove: function (e) {
            var point = this.getCanvasPoint(e.clientX, e.clientY);
            this.moveRubberBand(point);
        },

        startRubberBand: function () {
            this.rubberBandCoords = {
                startX: 0,
                startY: 0,
                endX: this.boundingRect.width,
                endY: this.boundingRect.height
            };
            this.drawRubberBand();
        },

        moveRubberBand: function (point) {

            switch (this._currentCorner) {
                case (Corner.position.topLeft): {
                    this.rubberBandCoords.startX = point.x;
                    this.rubberBandCoords.startY = point.y;
                    break;
                }
                case (Corner.position.topRight): {
                    this.rubberBandCoords.endX = point.x
                    this.rubberBandCoords.startY = point.y;
                    break;
                }
                case (Corner.position.bottomLeft): {
                    this.rubberBandCoords.startX = point.x
                    this.rubberBandCoords.endY = point.y
                    break;
                }
                case (Corner.position.bottomRight): {
                    this.rubberBandCoords.endX = point.x
                    this.rubberBandCoords.endY = point.y;
                    break;
                }
            }

            this.drawRubberBand();
        },

        drawRubberBand: function () {
            var coords = this.getCoords();
            var rubberBandStyle = this.rubberBand.style;
            var bounding = this.boundingRect;

            var top = bounding.top + coords.top;
            var left = bounding.left + coords.left;
            var height = coords.height;
            var width = coords.width;

            rubberBandStyle.left = left + "px";
            rubberBandStyle.top = top + "px";
            rubberBandStyle.width = coords.width + "px";
            rubberBandStyle.height = coords.height + "px";
        },

        stopRubberBand: function (point) {
            this.moveRubberBand(point);
            var coords = this.getCoords();
            this.dispatchEvent("rubberbanded", coords);
        },

        getCoords: function () {
            var endX = Math.max(this.rubberBandCoords.startX, this.rubberBandCoords.endX);
            var endY = Math.max(this.rubberBandCoords.startY, this.rubberBandCoords.endY);

            var left = Math.min(this.rubberBandCoords.startX, this.rubberBandCoords.endX);
            var top = Math.min(this.rubberBandCoords.startY, this.rubberBandCoords.endY);
            var width = endX - left;
            var height = endY - top;

            return {
                left: left,
                top: top,
                width: width,
                height: height
            };
        },

        shutDown: function () {
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