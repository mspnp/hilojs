// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("Rotate Presenter", function () {

    var rotatePresenter, el, menuController, imageLoaderPromise, picture, urlBuilder;

    beforeEach(function () {
		el = new Specs.WinControlStub();
		el.style = {};

		picture = {};

		urlBuilder = {
			createObjectURL: function () {
				return "a url";
			}
		};

		imageLoaderPromise = new WinJS.Promise(function (done) {
			done([picture]);
		});

		menuController = new Specs.EventStub();

		rotatePresenter = new Hilo.Rotate.RotatePresenter(el, menuController, imageLoaderPromise, urlBuilder);
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

	describe("when resetting rotation back to the original", function () {

		beforeEach(function () {
			menuController.dispatchEvent("reset");
		});

		it("should reset the image rotation back to 0", function () {
			expect(el.style.transform).equals("rotate(0deg)");
		});
	});

});