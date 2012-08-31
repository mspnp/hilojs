// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Rotated Image Writer Constructor
    // --------------------------------

    function RotatedImageWriterConstructor(imageWriter) {
        this.imageWriter = imageWriter;
    }

    // Rotated Image Writer Members
    // ----------------------------

    var rotatedImageWriterMembers = {

	    // Pick a file to save the rotated version to, then save it
	    rotate: function (sourceFile, degrees) {
	        var that = this;
	        this.imageWriter.pickFile(sourceFile, "Rotated")
                .then(function (destFile) {
                    if (destFile) {
                        that.saveRotatedImage(sourceFile, destFile, degrees);
                    }
                });
	    },

        // Rotate an image to the specified degrees
	    saveRotatedImage: function (sourceFile, destFile, degrees) {

			// Keep data in-scope across multiple asynchronous methods.
		    var that = this,
                originalRotation,
				useEXIFOrientation;

		    var decodeProcessor = function (decoder) {

			    // get the EXIF orientation (if it's supported)
		        var decoderPromise = decoder.bitmapProperties.getPropertiesAsync(["System.Photo.Orientation"])
                .then(function (retrievedProps) {

                    // EXIF found and usable
                    useEXIFOrientation = true;
                    var exifRotation = retrievedProps["System.Photo.Orientation"];
                    originalRotation = Hilo.EXIFHelpers.convertExifOrientationToDegreesRotation(exifRotation.value);

                }, function (error) {
    			    // the file format does not support EXIF properties, continue without applying EXIF orientation.
                    switch (error.number) {
                        case Hilo.ImageWriter.WINCODEC_ERR_UNSUPPORTEDOPERATION:
    			        case Hilo.ImageWriter.WINCODEC_ERR_PROPERTYNOTSUPPORTED:
    			            useEXIFOrientation = false;
    			            originalRotation = 0;
    			            break;
    			        default:
    			            throw error;
    			    }
    			});

			    return decoderPromise;
			};

			var encodeProcessor = function (encoder) {
			    var adjustedDegrees = that.normalizeDegrees(degrees + originalRotation);

			    if (useEXIFOrientation) {
			        // EXIF is supported, so update the orientation flag to reflect 
			        // the user-specified rotation.
			        var netExifOrientation = Hilo.EXIFHelpers.convertDegreesRotationToExifOrientation(adjustedDegrees);

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
			        var rotation = that.getBitmapRotation(adjustedDegrees);
			        return encoder.bitmapTransform.rotation = rotation;

			    }
			}

			this.imageWriter.transFormAndSaveToDestination(sourceFile, destFile, {
			    decodeProcessor: decodeProcessor,
			    encodeProcessor: encodeProcessor
			});
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

    // Rotated Image Writer Definition
    // -------------------------------

    WinJS.Namespace.define("Hilo.Rotate", {
        RotatedImageWriter: WinJS.Class.define(RotatedImageWriterConstructor, rotatedImageWriterMembers)
    });

})();