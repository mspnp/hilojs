// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

xdescribe("Detail Presenter", function () {

    var detailPresenter, filmstripPresenter, flipviewPresenter, imageNav;

    beforeEach(function () {
        filmstripPresenter = new Specs.WinControlStub();

        imageNav = {
            setImageIndex: function (index) {
                imageNav.setImageIndex.wasCalled = true;
                imageNav.setImageIndex.itemIndex = index;
            }
        }

        flipviewPresenter = {
            showImageAt: function (index) {
                flipviewPresenter.showImageAt.wasCalled = true;
                flipviewPresenter.showImageAt.itemIndex = index;
            }
        };

        detailPresenter = new Hilo.Detail.DetailPresenter(flipviewPresenter, filmstripPresenter, imageNav);

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
            expect(imageNav.setImageIndex.wasCalled).true;
            expect(imageNav.setImageIndex.itemIndex).equals(1);
        });
    });

});
