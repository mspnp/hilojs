// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("crop selection view", function () {

    var canvasEl, cropSelectionEl, cropSelection, cropSelectionView;

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

    beforeEach(function () {
        setupDOMElements();
        var canvasSize = canvasEl.getBoundingClientRect();
        cropSelection = new Hilo.Crop.CropSelection(canvasSize);

        cropSelectionView = new Hilo.Crop.CropSelectionView(cropSelection, canvasEl, cropSelectionEl);
    });

    describe("when drawing the crop selection", function () {
        var cropSelectionCoords;

        beforeEach(function () {
            cropSelectionCoords = cropSelection.getCoords();

            cropSelectionView.draw(cropSelectionCoords);
        });

        it("should move the cropSelectionEl to the cropSelection's coordinates", function () {
            var bounds = cropSelectionEl.getBoundingClientRect();

            expect(bounds.top).equals(cropSelectionCoords.startX);
            expect(bounds.left).equals(cropSelectionCoords.startY);
            expect(bounds.width).equals(cropSelectionCoords.endX - cropSelectionCoords.startX);
            expect(bounds.height).equals(cropSelectionCoords.endY - cropSelectionCoords.startY);
        });
    });

});
