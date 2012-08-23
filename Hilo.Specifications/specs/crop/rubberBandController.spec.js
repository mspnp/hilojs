// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("rubber band controller", function () {

    function setupDOMElements() {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement("canvas"));

        canvasEl = frag.querySelector("canvas");

        rubberBandEl = document.createElement("div");
        rubberBandEl.id = "rubberBand";
        frag.appendChild(rubberBandEl);

        var topLeft = document.createElement("div");
        topLeft.id = "topLeft";
        rubberBandEl.appendChild(topLeft);

        var topRight = document.createElement("div");
        topRight.id = "topRight";
        rubberBandEl.appendChild(topRight);

        var bottomLeft = document.createElement("div");
        bottomLeft.id = "bottomLeft";
        rubberBandEl.appendChild(bottomLeft);

        var bottomRight = document.createElement("div");
        bottomRight.id = "bottomRight";
        rubberBandEl.appendChild(bottomRight);
    }

    var controller, canvasEl, rubberBandEl, rubberBand;

    beforeEach(function () {
        setupDOMElements();
        rubberBand = {};

        controller = new Hilo.Crop.RubberBandController(rubberBand, canvasEl, rubberBandEl);
    });

    describe("when a corner is moved", function () {

        beforeEach(function () {
            var position = Hilo.Crop.RubberBandCorner.position.topLeft;
            var corner = controller.corners[position];
            controller.startCornerMove({ detail: { corner: corner } });

            controller.cornerMove({ detail: { coords: { x: 1, y: 2 } } });
        });

        it("should update the rubber band coordinates", function () {
            expect(rubberBand.startX).equals(1);
            expect(rubberBand.startY).equals(2);
        });

    });

});