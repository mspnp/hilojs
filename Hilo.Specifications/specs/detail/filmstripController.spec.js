describe("detail page", function () {
    describe("film strip controller", function () {

        var filmstripController, el;

        beforeEach(function () {
        	el = new Specs.WinControlStub();
            filmstripController = new Hilo.Detail.FilmstripController(el);
        });

        describe("when invoking a thumbnail", function () {
            var handler = function (args) {
                handler.wasCalled = true;
                handler.args = args.detail;
            }

            beforeEach(function () {
                filmstripController.addEventListener("imageInvoked", handler);

                el.winControl.dispatchEvent("iteminvoked", {
                	itemIndex: 1
                });
            });

            it("should trigger an imageInvoked event", function () {
                expect(handler.wasCalled).equals(true);
            });

            it("should tell me the index of the clicked item", function () {
            	expect(handler.args.itemIndex).equals(1);
            });
        });

    });
});