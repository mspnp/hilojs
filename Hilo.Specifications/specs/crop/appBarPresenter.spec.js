describe("crop app bar presenter", function () {

    var appBar, el, crop, save, reset;

    beforeEach(function () {
        crop = new Specs.WinControlStub();
        save = new Specs.WinControlStub();
        reset = new Specs.WinControlStub();

        el = new Specs.WinControlStub();
        el.addQuerySelector("#crop", crop);
        el.addQuerySelector("#save", save);
        el.addQuerySelector("#reset", reset);

        appBar = new Hilo.Crop.AppBarPresenter(el);
    });

    describe("when cropping", function () {
        var handler;

        beforeEach(function () {
            handler = function () {
                handler.wasCalled = true;
            };

            appBar.addEventListener("crop", handler);
            
            crop.dispatchEvent("click");
        });

        it("should dispatch a crop event", function () {
            expect(handler.wasCalled).equals(true);
        });
    });

    describe("when saving", function () {
        var handler;

        beforeEach(function () {
            handler = function () {
                handler.wasCalled = true;
            };

            appBar.addEventListener("save", handler);
            
            save.dispatchEvent("click");
        });

        it("should dispatch a save event", function () {
            expect(handler.wasCalled).equals(true);
        });
    });

    describe("when reseting", function () {
        var handler;

        beforeEach(function () {
            handler = function () {
                handler.wasCalled = true;
            };

            appBar.addEventListener("reset", handler);
            
            reset.dispatchEvent("click");
        });

        it("should dispatch a reset event", function () {
            expect(handler.wasCalled).equals(true);
        });
    });

});