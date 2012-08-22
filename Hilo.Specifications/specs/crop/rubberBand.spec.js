// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("rubber band", function () {

    var canvasEl, rubberBand;

    beforeEach(function () {
        // Create a document framgnet and a `<canvas>` element
        // within the fragment, so that the canvas element will
        // support calls to `getBoundingClientRect`.
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement("canvas"));
        canvasEl = frag.querySelector("canvas");

        // Create the SUT
        rubberBand = new Hilo.Crop.RubberBand(canvasEl);
    });

    describe("when initializing", function () {
        var coords;

        beforeEach(function(){
            coords = rubberBand.getCoords();
        });

        it("should set the starting coordinate to 0,0", function () {
            expect(coords.startX).equals(0);
            expect(coords.startY).equals(0);
        });

        it("should set the ending coordinate to the canvas width,height", function () {
            var canvasBounds = canvasEl.getBoundingClientRect();

            expect(coords.endX).equals(canvasBounds.width);
            expect(coords.endY).equals(canvasBounds.height);
        });
    });

    describe("when setting any of the coordinate values", function () {
        var moveHandler;

        beforeEach(function () {

            moveHandler = function (args) {
                if (!moveHandler.callCount) {
                    moveHandler.callCount = 0;
                }
                moveHandler.callCount += 1;
                moveHandler.args = args.detail;
            };

            rubberBand.addEventListener("move", moveHandler);

            rubberBand.startX = 1;
            rubberBand.startY = 2;
            rubberBand.endX = 3;
            rubberBand.endY = 4;
        });
        
        it("should dispatch a 'move' event for each coordinate value set", function () {
            expect(moveHandler.callCount).equals(4);
        });

        it("should include the coordinates in the 'move' event", function () {
            var coords = moveHandler.args.coords;

            expect(coords.startX).equals(1);
            expect(coords.startY).equals(2);
            expect(coords.endX).equals(3);
            expect(coords.endY).equals(4);
        });
    });
});