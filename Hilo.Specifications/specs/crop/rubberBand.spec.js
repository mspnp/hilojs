// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("rubber band", function () {

    var rubberBand;

    beforeEach(function () {
        // Create the SUT
        rubberBand = new Hilo.Crop.RubberBand();
    });

    describe("when initializing", function () {
        var coords;

        beforeEach(function () {
            coords = rubberBand.getCoords();
        });

        it("should set the starting coordinate to 0,0", function () {
            expect(coords.startX).equals(0);
            expect(coords.startY).equals(0);
        });

        it("should set the ending coordinate to 0,0", function () {
            expect(coords.endX).equals(0);
            expect(coords.endY).equals(0);
        });
    });

    describe("when resetting the rubber band to a canvas size", function () {
        var coords;

        beforeEach(function () {
            rubberBand.reset({
                width: 100,
                height: 200
            });

            coords = rubberBand.getCoords();
        });

        it("should set the starting coordinate to 0,0", function () {
            expect(coords.startX).equals(0);
            expect(coords.startY).equals(0);
        });

        it("should set the ending coordinate to canvasSize.height, canvasSize.width", function () {
            expect(coords.endX).equals(100);
            expect(coords.endY).equals(200);
        });
    });

    describe("when setting any of the coordinate values", function () {
        var moveHandler;

        beforeEach(function () {
            rubberBand.reset({
                width: 100,
                height: 100
            });

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
            rubberBand.endX = 50;
            rubberBand.endY = 60;
        });

        it("should dispatch a 'move' event for each coordinate value set", function () {
            expect(moveHandler.callCount).equals(4);
        });

        it("should include the coordinates in the 'move' event", function () {
            var coords = moveHandler.args.coords;

            expect(coords.startX).equals(1);
            expect(coords.startY).equals(2);
            expect(coords.endX).equals(50);
            expect(coords.endY).equals(60);
        });
    });

    describe("when the rubberband end coords are outside the canvas", function () {
        var moveHandler;

        beforeEach(function () {
            rubberBand.reset({
                width: 600,
                height: 800
            });

            moveHandler = function (args) {
                if (!moveHandler.callCount) {
                    moveHandler.callCount = 0;
                }
                moveHandler.callCount += 1;
                moveHandler.args = args.detail;
            };

            rubberBand.addEventListener("move", moveHandler);

            rubberBand.startX = -50;
            rubberBand.startY = -50;
            rubberBand.endX = 3000;
            rubberBand.endY = 4000;
        });

        it("should reset the rubber band startx to the left canvas edge", function () {
            expect(rubberBand.startX).equals(0);
        });

        it("should reset the rubber band starty to the top canvas edge", function () {
            expect(rubberBand.startY).equals(0);
        });
        it("should reset the rubber band width to the right canvas edge", function () {
            expect(rubberBand.endX).equals(600);
        });

        it("should reset the rubber band height to the bottom canvas edge", function () {
            expect(rubberBand.endY).equals(800);
        });
    });

    describe("when the rubberband end coords are less than 30x30, moving the end point", function () {
        var moveHandler;

        beforeEach(function () {
            rubberBand.reset({
                width: 600,
                height: 800
            });

            moveHandler = function (args) {
                if (!moveHandler.callCount) {
                    moveHandler.callCount = 0;
                }
                moveHandler.callCount += 1;
                moveHandler.args = args.detail;
            };

            rubberBand.addEventListener("move", moveHandler);

            rubberBand.startX = 10;
            rubberBand.startY = 10;
            rubberBand.endX = 20;
            rubberBand.endY = 20;
        });

        it("should leave the startx where it is", function () {
            expect(rubberBand.startX).equals(10);
        });

        it("should leave the starty where it is", function () {
            expect(rubberBand.startY).equals(10);
        });

        it("should reset the endx to startx + minwidth", function () {
            expect(rubberBand.endX).equals(40);
        });

        it("should reset the endy to starty + minheight", function () {
            expect(rubberBand.endY).equals(40);
        });
    });

    describe("when the rubberband end coords are less than 30x30, moving the start point", function () {
        var moveHandler;

        beforeEach(function () {
            rubberBand.reset({
                width: 600,
                height: 800
            });

            moveHandler = function (args) {
                if (!moveHandler.callCount) {
                    moveHandler.callCount = 0;
                }
                moveHandler.callCount += 1;
                moveHandler.args = args.detail;
            };

            rubberBand.addEventListener("move", moveHandler);

            rubberBand.endX = 50;
            rubberBand.endY = 50;
            rubberBand.startX = 40;
            rubberBand.startY = 40;
        });

        it("should leave the endx where it is", function () {
            expect(rubberBand.endX).equals(50);
        });

        it("should leave the endy where it is", function () {
            expect(rubberBand.endY).equals(50);
        });

        it("should reset the startx to endx - minwidth", function () {
            expect(rubberBand.startX).equals(20);
        });

        it("should reset the starty to endy - minheight", function () {
            expect(rubberBand.startY).equals(20);
        });
    });
});