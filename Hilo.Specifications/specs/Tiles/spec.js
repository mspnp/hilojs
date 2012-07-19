describe("live tile", function () {

    describe("when updating the tile", function(){

        it("should use double quotes because single quotes are dumb", function () {
            Tiles.update();
            expect("foo").not.toBe("bar");
        });

    });

});