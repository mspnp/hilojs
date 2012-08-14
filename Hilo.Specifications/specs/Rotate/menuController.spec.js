describe("rotate menu controller", function () {
	var WinControlStub = WinJS.Class.mix(function () { this.winControl = this }, WinJS.Utilities.eventMixin);

	var menuController, el, saveButton, cancelButton, clockwiseButton, counterClockwiseButton;

	beforeEach(function () {
		saveButton = new WinControlStub();
		cancelButton = new WinControlStub();
		clockwiseButton = new WinControlStub();
		counterClockwiseButton = new WinControlStub();

		el = {
			querySelector: function (selector) {
				if (selector === "#save") { return saveButton; }
				if (selector === "#cancel") { return cancelButton; }
				if (selector === "#clockwise") { return clockwiseButton; }
				if (selector === "#counterClockwise") { return counterClockwiseButton; }
			}
		};

		menuController = new Hilo.Rotate.MenuController(el);
	});

	describe("when the rotate menu is initialized", function () {

		it("should disable the save button", function () {
			expect(saveButton.disabled).equals(true);
		});

		it("should disable the cancel button", function () {
			expect(cancelButton.disabled).equals(true);
		});
	});

	describe("when clicking rotate clockwise", function () {
		var imageRotateHandler;

		beforeEach(function(){
			imageRotateHandler = function (args) {
				imageRotateHandler.args = args.detail;
			};

			menuController.addEventListener("rotate", imageRotateHandler);

			clockwiseButton.dispatchEvent("click");
		});

		it("should trigger image rotation, 90 degrees", function () {
			expect(imageRotateHandler.args.rotateDegrees).equals(90);
		});

		it("should enable the save button", function () {
			expect(saveButton.disabled).equals(false);
		});

		it("should enable the cancel button", function(){
			expect(cancelButton.disabled).equals(false);
		});
	});

	describe("when clicking rotate counter-clockwise", function () {
		var imageRotateHandler;

		beforeEach(function(){
			imageRotateHandler = function (args) {
				imageRotateHandler.args = args.detail;
			};

			menuController.addEventListener("rotate", imageRotateHandler);

			counterClockwiseButton.dispatchEvent("click");
		});

		it("should trigger image rotation, -90 degrees", function () {
			expect(imageRotateHandler.args.rotateDegrees).equals(-90);
		});

		it("should enable the save button", function () {
			expect(saveButton.disabled).equals(false);
		});

		it("should enable the cancel button", function(){
			expect(cancelButton.disabled).equals(false);
		});
	});

	describe("when clicking save", function () {
		var saveHandler;

		beforeEach(function () {
			saveHandler = function () {
				saveHandler.wasCalled = true;
			}

			menuController.addEventListener("save", saveHandler);

			saveButton.dispatchEvent("click");
		});

		it("should trigger image save", function () {
			expect(saveHandler.wasCalled).equals(true);
		});
	});

	describe("when clicking cancel", function () {
		var cancelHandler;

		beforeEach(function () {
			cancelHandler = function () {
				cancelHandler.wasCalled = true;
			}

			menuController.addEventListener("cancel", cancelHandler);

			cancelButton.dispatchEvent("click");
		});

		it("should trigger to cancel the image changes", function () {
			expect(cancelHandler.wasCalled).equals(true);
		});
	});

});