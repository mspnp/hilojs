// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("picture view", function () {

    var url, cropSelection, canvasEl, view;

    function setupDOMElements() {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement("canvas"));

        canvasEl = frag.querySelector("canvas");
    }

    beforeEach(function () {
        setupDOMElements();

        cropSelection = new Specs.EventStub();

        url = "http://placekitten.com/300/200";
    });

    describe("when initializing", function () {
        var drawImageStub;

        beforeEach(function (done) {

            drawImageStub = function () {
                drawImageStub.wasCalled = true;
                done();
            };

            this.original_drawImage = Hilo.Crop.PictureView.prototype.drawImage;
            Hilo.Crop.PictureView.prototype.drawImage = drawImageStub;

            view = new Hilo.Crop.PictureView(canvasEl, cropSelection, url);
        });

        afterEach(function () {
            Hilo.Crop.PictureView.prototype.drawImage = this.original_drawImage;
        });

        it("should show the picture", function () {
            expect(drawImageStub.wasCalled).equals(true);
        });
    });

});
