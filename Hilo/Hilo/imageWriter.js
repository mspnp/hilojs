(function () {
	"use strict";

	// Helper Methods
	// --------------

	var Helpers = {
		convertHResultToNumber: function (hresult) {
			if ((hresult > 0xFFFFFFFF) || (hresult < 0x80000000)) {
				throw new Error("Value is not a failure HRESULT.");
			}

			return hresult - 0xFFFFFFFF - 1;
		}
	}

	// Imports And Constants
	// ---------------------

	// Exception number constants. These constants are defined using values from winerror.h,
	// and are compared against error.number in the exception handlers in this scenario.

	// This file format does not support the requested operation; for example, metadata or thumbnails.
	var WINCODEC_ERR_UNSUPPORTEDOPERATION = Helpers.convertHResultToNumber(0x88982F81);
	// This file format does not support the requested property/metadata query.
	var WINCODEC_ERR_PROPERTYNOTSUPPORTED = Helpers.convertHResultToNumber(0x88982F41);
	// There is no codec or component that can handle the requested operation; for example, encoding.
	var WINCODEC_ERR_COMPONENTNOTFOUND = Helpers.convertHResultToNumber(0x88982F50);

	// Image Writer Constructor
	// ------------------------

	function ImageWriter() {
	}

	// Image Writer Methods
	// --------------------

	var imageWriterMethods = {
		save: function (file) {

			// Keep data in-scope across multiple asynchronous methods.
			var originalWidth,
				originalHeight,
				encoder,
				decoder,
				fileStream,
				useEXIFOrientation;

			var memStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();

			// Create a new encoder and initialize it with data from the original file.
			// The encoder writes to an in-memory stream, we then copy the contents to the file.
			// This allows the application to perform in-place editing of the file: any unedited data
			// is copied directly to the destination, and the original file is overwritten
			// with updated data.
			file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {

				fileStream = stream;
				return Windows.Graphics.Imaging.BitmapDecoder.createAsync(fileStream);

			}).then(function (_decoder) {

				decoder = _decoder;

				originalHeight = decoder.pixelHeight;
				originalWidth = decoder.pixelWidth;

				// get the EXIF orientation (if it's supported)
				return decoder.bitmapProperties.getPropertiesAsync(["System.Photo.Orientation"]);

			}).then(function (retrievedProps) {

				// EXIF is supported
				useEXIFOrientation = true;

			}, function (error) {

				// the file format does not support EXIF properties, continue without applying EXIF orientation.
				switch (error.number) {
					case WINCODEC_ERR_UNSUPPORTEDOPERATION:
					case WINCODEC_ERR_PROPERTYNOTSUPPORTED:
						useEXIFOrientation = false;
						break;
					default:
						throw error;
				}

			}).then(function () {

				// Set the encoder's destination to the temporary, in-memory stream.
				return Windows.Graphics.Imaging.BitmapEncoder.createForTranscodingAsync(memStream, decoder);

			}).then(function (_encoder) {
				encoder = _encoder;

				// Attempt to generate a new thumbnail to reflect any rotation operation.
				encoder.isThumbnailGenerated = true;

				if (useEXIFOrientation) {
					// If the file format supports EXIF orientation ("System.Photo.Orientation") then
					// update the orientation flag to reflect any user-specified rotation.
					// Otherwise, perform a hard rotate using BitmapTransform.
					var newOrientation = Windows.Storage.FileProperties.PhotoOrientation.normal;
					var netExifOrientation = newOrientation;

					// BitmapProperties requires the application to explicitly declare the type
					// of the property to be written - this is different from FileProperties which
					// automatically coerces the value to the correct type. System.Photo.Orientation
					// is defined as a UInt16.
					var orientationTypedValue = new Windows.Graphics.Imaging.BitmapTypedValue(
						netExifOrientation,
						Windows.Foundation.PropertyType.uint16
					);

					var properties = new Windows.Graphics.Imaging.BitmapPropertySet();
					properties.insert("System.Photo.Orientation", orientationTypedValue);

					return encoder.bitmapProperties.setPropertiesAsync(properties);
				} else {
					debugger;
					var rotation = Windows.Graphics.Imaging.BitmapRotation.none;
					var foo = encoder.bitmapTransform.rotation = rotation;
					return foo;
				}

			}).then(function () {

				return encoder.flushAsync();

			}).then(null, function (error) {

				switch (error.number) {
					// If the encoder does not support writing a thumbnail, then try again
					// but disable thumbnail generation.
					case WINCODEC_ERR_UNSUPPORTEDOPERATION:
						encoder.isThumbnailGenerated = false;
						return encoder.flushAsync();
					default:
						throw error;
				}

			}).then(function () {

				// Overwrite the contents of the file with the updated image stream.
				memStream.seek(0);
				fileStream.seek(0);
				fileStream.size = 0;

				return Windows.Storage.Streams.RandomAccessStream.copyAsync(memStream, fileStream);

			}).done(function () {

				// Finally, close each stream to release any locks.
				memStream && memStream.close();
				fileStream && fileStream.close();

			});
		}

	};

	// Public API
	// ----------

	WinJS.Namespace.define("Hilo", {
		ImageWriter: WinJS.Class.define(ImageWriter, imageWriterMethods)
	});
})();