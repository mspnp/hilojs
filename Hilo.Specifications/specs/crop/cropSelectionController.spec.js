// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("crop selection controller", function () {

    function setupDOMElements() {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement("canvas"));

        canvasEl = frag.querySelector("canvas");

        cropSelectionEl = document.createElement("div");
        cropSelectionEl.id = "cropSelection";
        frag.appendChild(cropSelectionEl);

        var topLeft = document.createElement("div");
        topLeft.id = "topLeft";
        cropSelectionEl.appendChild(topLeft);

        var topRight = document.createElement("div");
        topRight.id = "topRight";
        cropSelectionEl.appendChild(topRight);

        var bottomLeft = document.createElement("div");
        bottomLeft.id = "bottomLeft";
        cropSelectionEl.appendChild(bottomLeft);

        var bottomRight = document.createElement("div");
        bottomRight.id = "bottomRight";
        cropSelectionEl.appendChild(bottomRight);
    }

    var controller, canvasEl, cropSelectionEl, cropSelection;

    beforeEach(function () {
        setupDOMElements();
        cropSelection = {};

        controller = new Hilo.Crop.CropSelectionController(cropSelection, canvasEl, cropSelectionEl);
    });

    describe("when a corner is moved", function () {

        beforeEach(function () {
            var position = Hilo.Crop.CropSelectionCorner.position.topLeft;
            var corner = controller.corners[position];
            controller.startCornerMove({ detail: { corner: corner } });

            controller.cornerMove({ detail: { coords: { x: 1, y: 2 } } });
        });

        it("should update the crop selection coordinates", function () {
            expect(cropSelection.startX).equals(1);
            expect(cropSelection.startY).equals(2);
        });

    });

});