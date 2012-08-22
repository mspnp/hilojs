// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("rubber band corner", function () {

    var corner;

    describe("when a corner is top left and asked to for a coordinate", function () {
        var coords;

        beforeEach(function () {
            var el = document.createElement("div");

            var position = Hilo.Crop.RubberBandCorner.position.topLeft;
            corner = new Hilo.Crop.RubberBandCorner(el, position);

            coords = corner.getUpdatedCoords({ x: 1, y: 1 });
        });

        it("should return startx value", function () {
            expect(coords.hasOwnProperty("startX")).equals(true);
        });

        it("should return starty value", function () {
            expect(coords.hasOwnProperty("startY")).equals(true);
        });
    });

    describe("when a corner is top right and asked to for a coordinate", function () {
        var coords;

        beforeEach(function () {
            var el = document.createElement("div");

            var position = Hilo.Crop.RubberBandCorner.position.topRight;
            corner = new Hilo.Crop.RubberBandCorner(el, position);

            coords = corner.getUpdatedCoords({ x: 1, y: 1 });
        });

        it("should return endx value", function () {
            expect(coords.hasOwnProperty("endX")).equals(true);
        });

        it("should return starty value", function () {
            expect(coords.hasOwnProperty("startY")).equals(true);
        });
    });

    describe("when a corner is bottom right and asked to for a coordinate", function () {
        var coords;

        beforeEach(function () {
            var el = document.createElement("div");

            var position = Hilo.Crop.RubberBandCorner.position.bottomRight;
            corner = new Hilo.Crop.RubberBandCorner(el, position);

            coords = corner.getUpdatedCoords({ x: 1, y: 1 });
        });

        it("should return endx value", function () {
            expect(coords.hasOwnProperty("endX")).equals(true);
        });

        it("should return endy value", function () {
            expect(coords.hasOwnProperty("endY")).equals(true);
        });
    });

    describe("when a corner is bottom left and asked to for a coordinate", function () {
        var coords;

        beforeEach(function () {
            var el = document.createElement("div");

            var position = Hilo.Crop.RubberBandCorner.position.bottomLeft;
            corner = new Hilo.Crop.RubberBandCorner(el, position);

            coords = corner.getUpdatedCoords({ x: 1, y: 1 });
        });

        it("should return startx value", function () {
            expect(coords.hasOwnProperty("startX")).equals(true);
        });

        it("should return endy value", function () {
            expect(coords.hasOwnProperty("endY")).equals(true);
        });
    });

});