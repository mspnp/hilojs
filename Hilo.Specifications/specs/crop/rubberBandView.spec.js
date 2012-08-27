// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("rubber band view", function () {

    var canvasEl, rubberBandEl, rubberBand, rubberBandView;

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

    beforeEach(function () {
        setupDOMElements();
        var canvasSize = canvasEl.getBoundingClientRect();
        rubberBand = new Hilo.Crop.RubberBand(canvasSize);

        rubberBandView = new Hilo.Crop.RubberBandView(rubberBand, canvasEl, rubberBandEl);
    });

    describe("when drawing the rubber band", function () {
        var rubberBandCoords;

        beforeEach(function () {
            rubberBandCoords = rubberBand.getCoords();

            rubberBandView.draw(rubberBandCoords);
        });

        it("should move the rubberBandEl to the rubberBand's coordinates", function () {
            var bounds = rubberBandEl.getBoundingClientRect();

            expect(bounds.top).equals(rubberBandCoords.startX);
            expect(bounds.left).equals(rubberBandCoords.startY);
            expect(bounds.width).equals(rubberBandCoords.endX - rubberBandCoords.startX);
            expect(bounds.height).equals(rubberBandCoords.endY - rubberBandCoords.startY);
        });
    });

});