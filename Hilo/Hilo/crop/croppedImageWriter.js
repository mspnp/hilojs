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

    // Imports And Constants
    // ---------------------
    var photoOrientation = Windows.Storage.FileProperties.PhotoOrientation;

    // Cropped Image Writer Constructor
    // --------------------------------

    function CroppedImageWriterConstructor(imageWriter) {
        this.imageWriter = imageWriter;
    }

    // Cropped Image Writer Members
    // ----------------------------

    var croppedImageWriterMembers = {

        // choose a destination file, then crop the image down to the
        // specified crop selection, saving it to the selected destination
        crop: function (sourceFile, cropSelection) {
            var self = this;
            return this.imageWriter.pickFile(sourceFile, "Cropped")
                .then(function (destFile) {
                    if (destFile) {
                        self.saveCroppedImage(sourceFile, destFile, cropSelection);
                        return true;
                    } else {
                        return false;
                    }
                });

        },

        // Do the actual file cropping and save it to the destination file
        saveCroppedImage: function (sourceFile, destFile, cropSelection) {

            var self = this,
                exifOrientation,
                imageSize;

            var decodeProcessor = function (decoder) {
                // get the image size
                imageSize = {
                    width: decoder.pixelWidth,
                    height: decoder.pixelHeight
                };

                var getOrientation = new WinJS.Promise(function (whenComplete, whenError) {
                    try {
                        var promise = decoder.bitmapProperties.getPropertiesAsync(["System.Photo.Orientation"]);
                        whenComplete(promise);
                    }
                    catch (error) {
                        whenError(error);
                    }
                });

                // get the EXIF orientation (if it's supported)
                // <SnippetHilojs_1110>
                var decoderPromise = getOrientation
                    .then(function (retrievedProps) {

                        // Even though the EXIF properties were returned, 
                        // they still might not include the `System.Photo.Orientation`.
                        // In that case, we will assume that the image is not rotated.
                        exifOrientation = (retrievedProps.size !== 0)
                            ? retrievedProps["System.Photo.Orientation"]
                            : photoOrientation.normal;

                    }, function (error) {
                        // the file format does not support EXIF properties, continue 
                        // without applying EXIF orientation.
                        switch (error.number) {
                            case Hilo.ImageWriter.WINCODEC_ERR_UNSUPPORTEDOPERATION:
                            case Hilo.ImageWriter.WINCODEC_ERR_PROPERTYNOTSUPPORTED:
                                // the image does not support EXIF orientation, so
                                // set it to normal. this allows the getRotatedBounds
                                // to work propertly.
                                exifOrientation = photoOrientation.normal;
                                break;
                            default:
                                throw error;
                        }
                    });
                    // </SnippetHilojs_1110>

                return decoderPromise;
            };

            var encodeProcessor = function (encoder) {
                // set the bounds (crop position / size) of the encoder, 
                // so that we only get the crop selection in the final
                // result
                var bounds = self.getRotatedBounds(exifOrientation, imageSize, cropSelection);
                encoder.bitmapTransform.bounds = bounds;
            };

            this.imageWriter.transFormAndSaveToDestination(sourceFile, destFile, {
                decodeProcessor: decodeProcessor,
                encodeProcessor: encodeProcessor
            });
        },

        getRotatedBounds: function (exifOrientation, imageSize, cropSelection) {
            var exifOrientationValue = exifOrientation.value,
                height, width, degreesRotation;

            if (exifOrientationValue === photoOrientation.rotate270 || exifOrientationValue === photoOrientation.rotate90) {
                height = imageSize.width;
                width = imageSize.height;
                imageSize.width = width;
                imageSize.height = height;
            }

            degreesRotation = Hilo.EXIFHelpers.convertExifOrientationToDegreesRotation(exifOrientationValue);

            return Hilo.EXIFHelpers.rotateRectClockwise(cropSelection, imageSize, degreesRotation);
        }
    };

    // Cropped Image Writer Definition
    // -------------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CroppedImageWriter: WinJS.Class.define(CroppedImageWriterConstructor, croppedImageWriterMembers)
    });

})();
