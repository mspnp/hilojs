describe("Detail page", function () {
    describe("detail page controller", function () {

        var detailPageController, filmstripController, flipviewController, imageNav;

        beforeEach(function () {
        	filmstripController = new Specs.WinControlStub();

            imageNav = {
                setImageIndex: function (index) {
                    imageNav.setImageIndex.wasCalled = true;
                    imageNav.setImageIndex.itemIndex = index;
                }
            }
            
            flipviewController = {
                showImageAt: function (index) {
                    flipviewController.showImageAt.wasCalled = true;
                    flipviewController.showImageAt.itemIndex = index;
                }
            };

            detailPageController = new Hilo.Detail.DetailPageController(flipviewController, filmstripController, imageNav);
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

            it("should set the selected image for the image navigation controller", function () {
                expect(imageNav.setImageIndex.wasCalled).equals(true);
                expect(imageNav.setImageIndex.itemIndex).equals(1);
            });
        });

    });
});