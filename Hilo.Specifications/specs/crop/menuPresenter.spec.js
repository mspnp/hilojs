describe("crop menu presenter", function () {

    var menu, el, crop, save, cancel;

    beforeEach(function () {
        crop = new Specs.WinControlStub();
        save = new Specs.WinControlStub();
        cancel = new Specs.WinControlStub();

        el = new Specs.WinControlStub();
        el.addQuerySelector("#crop", crop);
        el.addQuerySelector("#save", save);
        el.addQuerySelector("#cancel", cancel);

        menu = new Hilo.Crop.MenuPresenter(el);
    });

    describe("when cropping", function () {
        var handler;

        beforeEach(function () {
            handler = function () {
                handler.wasCalled = true;
            };

            menu.addEventListener("crop", handler);
            
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

            menu.addEventListener("save", handler);
            
            save.dispatchEvent("click");
        });

        it("should dispatch a save event", function () {
            expect(handler.wasCalled).equals(true);
        });
    });

    describe("when cancelling", function () {
        var handler;

        beforeEach(function () {
            handler = function () {
                handler.wasCalled = true;
            };

            menu.addEventListener("cancel", handler);
            
            cancel.dispatchEvent("click");
        });

        it("should dispatch a cancel event", function () {
            expect(handler.wasCalled).equals(true);
        });
    });

});