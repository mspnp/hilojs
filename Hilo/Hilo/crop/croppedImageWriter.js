(function () {
    "use strict";


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
            var that = this;
            this.imageWriter.pickFile(sourceFile, "Cropped")
                .then(function (destFile) {
                    if (destFile) {
                        that.saveCroppedImage(sourceFile, destFile, cropSelection);
                    }
                });

        },

        // Do the actual file cropping and save it to the destination file
        saveCroppedImage: function (sourceFile, destFile, cropSelection) {

            var that = this,
                exifOrientation;

            var decodeProcessor = function (decoder) {
                // get the EXIF orientation (if it's supported)
                var decoderPromise = decoder.bitmapProperties.getPropertiesAsync(["System.Photo.Orientation"])
                    .then(function (retrievedProps) {

                        exifOrientation = retrievedProps["System.Photo.Orientation"];

                    }, function (error) {
                        // the file format does not support EXIF properties, continue without applying EXIF orientation.
                        switch (error.number) {
                            case Hilo.ImageWriter.WINCODEC_ERR_UNSUPPORTEDOPERATION:
                            case Hilo.ImageWriter.WINCODEC_ERR_PROPERTYNOTSUPPORTED:
                                exifOrientation = false;
                                break;
                            default:
                                throw error;
                        }
                    });

                return decoderPromise;
            };

            var encodeProcessor = function (encoder) {
                // set the bounds (crop position / size) of the encoder, 
                // so that we only get the crop selection in the final
                // result

                var bounds = that.getRotatedBounds(exifOrientation, cropSelection);

                encoder.bitmapTransform.bounds = bounds;
            }

            this.imageWriter.transFormAndSaveToDestination(sourceFile, destFile, {
                decodeProcessor: decodeProcessor,
                encodeProcessor: encodeProcessor
            });
        },

        getRotatedBounds: function (exifOrientation, cropSelection) {
            var bounds, x, y, height, width;
            var orientation = Windows.Storage.FileProperties.PhotoOrientation;

            if (exifOrientation) {
                switch (exifOrientation.value) {
                    case orientation.rotate90: {
                        x = cropSelection.endY;
                        y = cropSelection.startX;
                        width = cropSelection.height;
                        height = cropSelection.width;
                        break;
                    }
                    case orientation.rotate180: {
                        x = cropSelection.endX;
                        y = cropSelection.endY;
                        width = cropSelection.width;
                        height = cropSelection.height;
                        break;
                    }
                    case orientation.rotate270: {
                        x = cropSelection.startY;
                        y = cropSelection.endX;
                        width = cropSelection.height;
                        height = cropSelection.width;
                        break;
                    }
                    default: {
                        x = cropSelection.startX;
                        y = cropSelection.startY;
                        width = cropSelection.width;
                        height = cropSelection.height;
                        break;
                    }
                }
            }

            return {
                x: parseInt(x, 10),
                y: parseInt(y, 10),
                width: parseInt(width, 10),
                height: parseInt(height, 10)
            };
        }
    };

    // Cropped Image Writer Definition
    // -------------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CroppedImageWriter: WinJS.Class.define(CroppedImageWriterConstructor, croppedImageWriterMembers)
    });

})();