// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("hub view controller", function () {
    "use strict";

    var hubView, nav, imageNav, listView;

    beforeEach(function () {
        listView = new Specs.WinControlStub();
        listView.winControl.setDataSource = function () { };

        nav = {
            navigate: function () {
                nav.navigate.args = arguments;
                nav.navigate.wasCalled = true;
            }
        };

        imageNav = {
            setImageIndex: function (index) {
                imageNav.setImageIndex.wasCalled = true;
                imageNav.setImageIndex.itemIndex = index;
            },

            clearImageIndex: function () {
                imageNav.clearImageIndex.wasCalled = true;
            },
            setQueryForSelection: function () { },
            clearQuery: function () { }
        };
    });

    describe("when first starting", function () {

        var boundViewModels,
            imageViewModels;

        beforeEach(function (done) {
            boundViewModels = [];
            imageViewModels = [];

            listView.winControl.setDataSource = function (itemsToBind) {
                boundViewModels = itemsToBind;
            };

            var imageItemDate = new Date("Jan 1, 1975");

            imageViewModels.push({
                className: "thumbnail",
                itemDate: imageItemDate
            });

            imageViewModels.push({
                className: "thumbnail",
                itemDate: imageItemDate
            });

            imageViewModels.push({
                className: "thumbnail",
                itemDate: new Date("Feb 1, 1975")
            });

            var queryBuilder = new Hilo.ImageQueryBuilder()
            queryBuilder.build = function () {
                return {
                    execute: function () {
                        return WinJS.Promise.as(imageViewModels);
                    }
                };
            };

            hubView = new Hilo.Hub.HubViewController(nav, imageNav, listView, queryBuilder);
            hubView.start({}).then(function () { done(); });
        });

        it("should bind the images return from the query", function () {
            expect(boundViewModels.length).equal(imageViewModels.length);
        });

        it("should count images with the same date (month/year) as being in the same group", function () {
            expect(boundViewModels[0].groupIndex).equal(0);
            expect(boundViewModels[1].groupIndex).equal(1);
        });

        it("should count images with the different dates (month/year) as being in a different group", function () {
            expect(boundViewModels[2].groupIndex).equal(0);
        });
    });

    describe("after the controller is start", function () {

        beforeEach(function (done) {

            var whenFolderIsReady = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync("Indexed");

            whenFolderIsReady.then(function (folder) {
                var queryBuilder = new Hilo.ImageQueryBuilder()

                hubView = new Hilo.Hub.HubViewController(nav, imageNav, listView, queryBuilder);
                hubView.start(folder).then(function () { done(); });

            });
        });

        describe("given nothing is selected, when selecting a picture", function () {

            beforeEach(function () {
                var picture = { groupIndex: 0, itemDate: new Date() };
                listView.dispatchEvent("selectionChanged", { hasItemSelected: true, itemIndex: 1, item: picture });
            });

            it("should set the image index and show the app bar", function () {
                expect(imageNav.setImageIndex.wasCalled).true;
                expect(imageNav.setImageIndex.itemIndex).equals(1);
            });

        });

        describe("when a picture is selected and deselecting it", function () {

            beforeEach(function () {
                var picture = { groupIndex: 0, itemDate: new Date() };
                listView.dispatchEvent("selectionChanged", { hasItemSelected: true, item: picture });
                listView.dispatchEvent("selectionChanged", { hasItemSelected: false });
            });

            it("should hide the appbar", function () {
                expect(imageNav.clearImageIndex.wasCalled).true;
            });

        });

        describe("when a picture is selected and selecting another", function () {

            beforeEach(function () {
                var picture = { groupIndex: 0, itemDate: new Date() };
                listView.dispatchEvent("selectionChanged", { hasItemSelected: true, itemIndex: 0, item: picture });
                listView.dispatchEvent("selectionChanged", { hasItemSelected: true, itemIndex: 1, item: picture });
            });

            it("should reveal the appbar", function () {
                expect(imageNav.setImageIndex.wasCalled).true;
                expect(imageNav.setImageIndex.itemIndex).equals(1);
            });

        });

        describe("when a picture is invoked (touched or clicked)", function () {

            beforeEach(function () {
                var item = {
                    data: {
                        itemDate: new Date("Jan 5 1973"),
                        groupIndex: 1
                    },
                    index: 99
                };
                listView.dispatchEvent("itemInvoked", { item: item });
            });


            it("should navigate to the detail page", function () {
                expect(nav.navigate.args[0]).equals("/Hilo/detail/detail.html");
            });

            it("should pass along the index of the selected picture", function () {
                expect(nav.navigate.args[1].itemIndex).equal(99);
            });

            it("should pass along the month/year query for the invoked picture", function () {
                expect(nav.navigate.args[1].query).exist;
            });
        });

    });
});