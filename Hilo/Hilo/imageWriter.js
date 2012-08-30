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

    // Much of this code and the comments found within it are borrowed from the 
    // [Simple imaging sample][1] for building a simple image processing 
    // application. See that sample for a more complete list of what can be done 
    // with imaging in Metro applications.
    //
    // [1]: http://code.msdn.microsoft.com/windowsapps/Simple-Imaging-Sample-a2dec2b0

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

	function ImageWriterConstructor() {
	}

    // Image Writer Methods
    // --------------------

	var imageWriterMethods = {

	    // Open the filepicker, defaulting it to the currently
	    // used source file, allowing another file name to be
	    // selected if desired
	    pickFile: function (sourceFile) {
	        var savePicker = new Windows.Storage.Pickers.FileSavePicker();

	        // default to saving in the pictures library, with the original filename
	        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
	        savePicker.suggestedFileName = sourceFile.displayName + "-Cropped" + sourceFile.fileType;

	        // Dropdown of file types the user can save the file as
	        savePicker.fileTypeChoices.insert("BMP", [".bmp"]);
	        savePicker.fileTypeChoices.insert("GIF", [".gif"]);
	        savePicker.fileTypeChoices.insert("JPG", [".jpg", ".jpeg"]);
	        savePicker.fileTypeChoices.insert("PNG", [".png"]);
	        savePicker.fileTypeChoices.insert("TIFF", [".tiff"]);

	        // run the picker and get the filename that the person chose
	        return savePicker.pickSaveFileAsync();
	    },

	    // choose a destination file, then crop the image down to the
	    // specified crop selection, saving it to the selected destination
	    crop: function (sourceFile, rect, rectOffset) {

	        var that = this;
	        this.pickFile(sourceFile)
                .then(function (destFile) {
                    if (destFile) {
                        that.cropAndSave(sourceFile, destFile, rect, rectOffset);
                    }
                });

	    },

	    // Do the actual file cropping and save it to the destination file
	    cropAndSave: function (sourceFile, destFile, rect, rectOffset) {

	        // save the source to the destination

			// Keep data in-scope across multiple asynchronous methods.
	        var originalWidth,
				originalHeight,
				encoder,
				decoder,
				sourceStream,
	            destStream;

			var that = this;
			var memStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();

			// Create a new encoder and initialize it with data from the original file.
			// The encoder writes to an in-memory stream, we then copy the contents to the file.
			// This allows the application to perform in-place editing of the file: any unedited data
			// is copied directly to the destination, and the original file is overwritten
			// with updated data.
			sourceFile.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {

				sourceStream = stream;
				return Windows.Graphics.Imaging.BitmapDecoder.createAsync(sourceStream);

			}).then(function (_decoder) {

				decoder = _decoder;

				// Set the encoder's destination to the temporary, in-memory stream.
				return Windows.Graphics.Imaging.BitmapEncoder.createForTranscodingAsync(memStream, decoder);

			}).then(function (_encoder) {
				encoder = _encoder;

				// Attempt to generate a new thumbnail to reflect any rotation operation.
				encoder.isThumbnailGenerated = true;

				//if (useEXIFOrientation) {
				//	// EXIF is supported, so update the orientation flag to reflect 
				//	// the user-specified rotation.
				//	var netExifOrientation = that.getEXIFRotation(degrees);

				//	// BitmapProperties requires the application to explicitly declare the type
				//	// of the property to be written - this is different from FileProperties which
				//	// automatically coerces the value to the correct type. System.Photo.Orientation
				//	// is defined as a UInt16.
				//	var orientationTypedValue = new Windows.Graphics.Imaging.BitmapTypedValue(
				//		netExifOrientation,
				//		Windows.Foundation.PropertyType.uint16
				//	);

				//	var properties = new Windows.Graphics.Imaging.BitmapPropertySet();
				//	properties.insert("System.Photo.Orientation", orientationTypedValue);

				//	return encoder.bitmapProperties.setPropertiesAsync(properties);
				//} else {

				//	// EXIF is not supported, so rever to bitmap rotation
				//	var rotation = that.getBitmapRotation(degrees);
				//	return encoder.bitmapTransform.rotation = rotation;

				//}

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
			    // open the destination stream
			    return destFile.openAsync(Windows.Storage.FileAccessMode.readWrite)
			}).then(function (_destStream) {
			    destStream = _destStream;

			    // copy the contents of the memory stream to the destination
				memStream.seek(0);
				destStream.seek(0);
				destStream.size = 0;

				return Windows.Storage.Streams.RandomAccessStream.copyAsync(memStream, destStream);
			}).done(function () {

			    // Finally, close each stream to release any locks.
				memStream && memStream.close();
				sourceStream && sourceStream.close();
				destStream && destStream.close();

			});
	    },

		// Rotate an image to the specified degrees
		rotate: function (file, degrees) {
		    degrees = this.normalizeDegrees(degrees);

            // Keep data in-scope across multiple asynchronous methods.
            var originalWidth,
                originalHeight,
                encoder,
                decoder,
                fileStream,
                useEXIFOrientation;

            var that = this;
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
                    // EXIF is supported, so update the orientation flag to reflect 
                    // the user-specified rotation.
                    var netExifOrientation = that.getEXIFRotation(degrees);

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

                    // EXIF is not supported, so rever to bitmap rotation
                    var rotation = that.getBitmapRotation(degrees);
                    return encoder.bitmapTransform.rotation = rotation;

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
        },

        // Converts a number of degrees in to a [PhotoOrientation][2] for
        // files that support EXIF properties.
        //
        // [2]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.storage.fileproperties.photoorientation.aspx
        //
        getEXIFRotation: function (degrees) {
            var rotation; 

            if (degrees === 0) {
                rotation = Windows.Storage.FileProperties.PhotoOrientation.normal;
            } else {
                rotation = Windows.Storage.FileProperties.PhotoOrientation["rotate" + degrees];
            }
            
            return rotation;
        },

        // Converts a number of degrees in to a [BitmapRotation][3] for
        // files that do not support EXIF properties.
        //
        // [3]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.graphics.imaging.bitmaprotation.aspx
        //
        getBitmapRotation: function (degrees) {
            var rotation; 

            if (degrees === 0) {
                rotation = Windows.Graphics.Imaging.BitmapRotation.none;
            } else {
                rotation = Windows.Graphics.Imaging.BitmapRotation["clockwise" + degrees + "Degrees"];
            }
            
            return rotation;
        },

        // Normalizes any number to a value that fall within
        // 0 to 359 degrees.
        //
        // Examples: 
        //   45 -> 90
        //   90 -> 90
        //   100 -> 90
        //   180 -> 180
        //   250 -> 270
        //   359 -> 0
        //   360 -> 0
        //   720 -> 0
        normalizeDegrees: function (degrees) {
            var result;

            // convert negative (counter-clockwise 
            // rotation) to positive (clockwise)
            if (degrees < 0) {
                degrees = 360 - Math.abs(degrees);
            }

            // round to the nearest 90 degrees
            var remainder = degrees % 90;
            if (remainder < 45) {
                result = degrees - remainder;
            } else {
                result = degrees + (90 - remainder);
            }

            // Normalize to 0..359
            return result % 360;
        }

    };

    // Public API
    // ----------

	WinJS.Namespace.define("Hilo", {
		ImageWriter: WinJS.Class.define(ImageWriterConstructor, imageWriterMethods)
	});
})();
