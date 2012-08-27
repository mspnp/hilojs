// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("rubber band", function () {

    var rubberBand, canvasSize;

    beforeEach(function () {
        canvasSize = {
            height: 800,
            width: 600
        };

        // Create the SUT
        rubberBand = new Hilo.Crop.RubberBand(canvasSize);
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
            expect(coords.endX).equals(canvasSize.width);
            expect(coords.endY).equals(canvasSize.height);
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

    describe("when the rubberband end coords are outside the canvas", function () {
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

            rubberBand.startX = 50;
            rubberBand.startY = 50;
            rubberBand.endX = 3000;
            rubberBand.endY = 4000;
        });
        
        it("should reset the rubber band width to the right canvas edge", function () {
            expect(rubberBand.endX).equals(600);
        });

        it("should reset the rubber band height to the bottom canvas edge", function () {
            expect(rubberBand.endY).equals(800);
        });
    });
});