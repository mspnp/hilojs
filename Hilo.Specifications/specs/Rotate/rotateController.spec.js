describe("rotate controller", function () {

	var rotateController, el, menuController;

	beforeEach(function () {
		el = new Specs.WinControlStub();
		el.style = {
			transform: "rotate(0deg)"
		};

		menuController = new Specs.EventStub();

		rotateController = new Hilo.Rotate.RotateController(el, menuController);
	});

	describe("when rotating an image", function () {

		beforeEach(function () {
			menuController.dispatchEvent("rotate", {
				rotateDegrees: 90
			});
		});

		it("should add the specified degrees to the image rotation", function () {
			expect(el.style.transform).equals("rotate(90deg)");
		});
	});

	describe("when resetting rotation back to the original", function(){
		it("should reset the image rotation back to 0");
	});

});