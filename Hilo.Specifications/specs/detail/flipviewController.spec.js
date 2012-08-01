describe('detail page', function () {
    describe('flip view controller', function () {

        var flipviewController, el;

        beforeEach(function () {
            el = {
                winControl: {}
            };

            flipviewController = new Hilo.Detail.FlipviewController(el);
        });

        describe('when an image has been selected', function () {
            var imageIndex = 3; 

            beforeEach(function () {
                flipviewController.showImageAt(imageIndex);
            });

            it('should show the image by its index', function () {
                expect(el.winControl.currentPage).equals(imageIndex);
            });
        });

    });
});