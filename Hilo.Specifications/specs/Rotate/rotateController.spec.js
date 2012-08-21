// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("rotate controller", function () {

	var rotateController, el, menuController, imageLoaderPromise, picture, urlBuilder;

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

		rotateController = new Hilo.Rotate.RotateController(el, menuController, imageLoaderPromise, urlBuilder);
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

	describe("when showing an image", function () {
		beforeEach(function () {
			rotateController.showImage("a url");
		});

		it("should set the image source", function () {
			expect(el.src).equals("a url");
		});
	});

});