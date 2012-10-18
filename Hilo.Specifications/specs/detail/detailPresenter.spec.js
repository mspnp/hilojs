// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

xdescribe("Detail Presenter", function () {

    var detailPresenter, filmstripPresenter, flipviewPresenter, hiloAppBar;

    beforeEach(function () {
        filmstripPresenter = new Specs.WinControlStub();

        hiloAppBar = {
            setImageIndex: function (index) {
                hiloAppBar.setImageIndex.wasCalled = true;
                hiloAppBar.setImageIndex.itemIndex = index;
            }
        }

        flipviewPresenter = {
            showImageAt: function (index) {
                flipviewPresenter.showImageAt.wasCalled = true;
                flipviewPresenter.showImageAt.itemIndex = index;
            }
        };

        detailPresenter = new Hilo.Detail.DetailPresenter(flipviewPresenter, filmstripPresenter, hiloAppBar);

        var query = {
            execute: function () {
                return WinJS.Promise.as([]);
            }
        };
        detailPresenter.start({ query: query, itemIndex: 0, itemName: "some.jpg" });
    });

    describe("when an image has been activated", function () {
        beforeEach(function () {
            filmstripPresenter.dispatchEvent("imageInvoked", { itemIndex: 1 });
        });

        it("should show the image", function () {
            expect(flipviewPresenter.showImageAt.wasCalled).true;
            expect(flipviewPresenter.showImageAt.itemIndex).equals(1);
        });

        it("should set the selected image for the image navigation presenter", function () {
            expect(hiloAppBar.setImageIndex.wasCalled).true;
            expect(hiloAppBar.setImageIndex.itemIndex).equals(1);
        });
    });

});
