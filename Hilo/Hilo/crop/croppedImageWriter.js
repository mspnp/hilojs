(function () {
    "use strict";


    // Cropped Image Writer Constructor
    // --------------------------------

    function CroppedImageWriterConstructor(imageWriter){
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
	        var encodeProcessor = function (encoder) {
	            // set the bounds (crop position / size) of the encoder, 
	            // so that we only get the crop selection in the final
	            // result

	            var bounds = {
	                x: parseInt(cropSelection.startX, 10),
	                y: parseInt(cropSelection.startY, 10),
	                width: parseInt(cropSelection.width, 10),
	                height: parseInt(cropSelection.height, 10)
	            };

	            encoder.bitmapTransform.bounds = bounds;
	        }

	        this.imageWriter.transFormAndSaveToDestination(sourceFile, destFile, {
			    encodeProcessor: encodeProcessor
			});
	    }
    };

    // Cropped Image Writer Definition
    // -------------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CroppedImageWriter: WinJS.Class.define(CroppedImageWriterConstructor, croppedImageWriterMembers)
    });

})();