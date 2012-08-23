// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
	"use strict";

	// Imports And Constants
	// ---------------------

	var thumbnailMode = Windows.Storage.FileProperties.ThumbnailMode;

	// Private/Helper Methods
	// ----------------------

	function urlFor(blob) {
		var url = "";
		if (blob) {
			url = "url(" + URL.createObjectURL(blob) + ")";
		}
		return url;
	}

	// Picture Constructor Function
	// ----------------------------

	function Picture(file) {
		var self = this;

		this.storageFile = file;

		this._initObservable();
		this.addProperty("name", file.name);
		this.addProperty("url", "");
		this.addProperty("src", "");
		this.addProperty("itemDate", "");
		this.addProperty("className", "thumbnail");

		file.getThumbnailAsync(thumbnailMode.picturesView).then(function (thumbnail) {
			self.updateProperty("url", urlFor(thumbnail));
		});

		file.properties.retrievePropertiesAsync(["System.ItemDate"]).then(function (retrieved) {
			self.updateProperty("itemDate", retrieved.lookup("System.ItemDate"));
		});
	}

	// Picture Instance Methods
	// ------------------------

	var pictureMethods = {
		loadImage: function () {
			this.updateProperty("src", urlFor(this.storageFile));
		}
	};

	// Picture Type methods
	// --------------------

	var pictureTypeMethods = {

	    // This is a convenience method, typically used in combination with `array.map`:
        //
	    // ```js
        // var viewmodels = someArrayOfStorageFiles.map(Hilo.Picture.from);
	    // ```

		from: function (file) {
			return new Hilo.Picture(file);
		},

	    // This function is to be used in declarative binding in the markup:
	    //
	    // ```html
	    // <img src="#" data-win-bind="src: src Hilo.Picture.bindToImageSrc" />
	    // ```
		bindToImageSrc: WinJS.Binding.initializer(function (source, sourceProperties, target, targetProperties) {
			// We're ignoring the properties provided in the binding.
			// We are assuming that we'll always extract the `src` property from the `source`
			// and bind it to the `src` of the `target` (which we expect to be an image tag).

			if (!source.src) {
				source.updateProperty("src", URL.createObjectURL(source.storageFile));
			}

			target.setAttribute('src', source.src);
		}),
	};

	// Public API
	// ----------

	var PictureBase = WinJS.Class.define(Picture, pictureMethods, pictureTypeMethods);

	WinJS.Namespace.define("Hilo", {
	    Picture: WinJS.Class.mix(PictureBase, WinJS.Binding.dynamicObservableMixin)
	});

}());