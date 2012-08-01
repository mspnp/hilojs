describe("Detail page", function () {
    describe("detail page controller", function () {

        var detailPageController, filmstripController, flipviewController;

        beforeEach(function () {
            var FilmStrip = WinJS.Class.mix(function () { }, WinJS.Utilities.eventMixin);
            filmstripController = new FilmStrip();
            
            flipviewController = {
                showImageAt: function (index) {
                    flipviewController.showImageAt.wasCalled = true;
                    flipviewController.showImageAt.itemIndex = index;
                }
            };

            detailPageController = new Hilo.Detail.DetailPageController(flipviewController, filmstripController);
            detailPageController.run();
        });

        describe("when an image has been activated", function () {
            beforeEach(function () {
                filmstripController.dispatchEvent("imageInvoked", { itemIndex: 1 });
            });

            it("should show the image", function () {
                expect(flipviewController.showImageAt.wasCalled).equals(true);
                expect(flipviewController.showImageAt.itemIndex).equals(1);
            });
        });

    });
});