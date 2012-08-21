// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("The data adapter from the month groups", function () {
    "use strict";

    var adapter;
    var someItemDate;
    var itemsInFolder = 123;

    beforeEach(function () {

        someItemDate = new Date("Jan 1, 1975");

        var queryBuilder = new Hilo.ImageQueryBuilder();

        var storageFolderQueryResult = {
            getFoldersAsync: function () {
                return WinJS.Promise.as([]);
            },
            getItemCountAsync: function () {
                return WinJS.Promise.as(itemsInFolder);
            }
        };

        var storageFolder = {
            createFolderQueryWithOptions: function () { return storageFolderQueryResult; }
        };

        var identifyMonthGroup = function (date) {
            return "month year";
        };

        adapter = new Hilo.month.GroupsDataAdapter(queryBuilder, storageFolder, identifyMonthGroup);
    });

    describe("when converting folders to list view groups, the result", function () {

        var result;
        var fileCount = 99;

        beforeEach(function (done) {

            var fileProperties = {
                lookup: function (propertyName) { return someItemDate; }
            };

            var storageFile = {
                properties: {
                    retrievePropertiesAsync: function (propertyList) {
                        return WinJS.Promise.as(fileProperties);
                    }
                }
            };

            var storageFileQueryResult = {
                getItemCountAsync: function () {
                    return WinJS.Promise.as(fileCount);
                },
                getFilesAsync: function () {
                    return WinJS.Promise.as([storageFile]);
                },
            };

            var storageFolder = {
                name: 'month year',
                createFileQueryWithOptions: function () { return storageFileQueryResult; },
            };

            adapter
                .toListViewHeaderGroup(storageFolder)
                .then(function (value) {
                    result = value;
                    done();
                });
        });

        it("should include the count for the folder", function () {
            expect(result.data.count).equal(fileCount);
        });

        it("should make the folder's tile the month", function () {
            expect(result.data.title).equal("month");
        });

        it("should include a key for the folder", function () {
            expect(result.key).equal("month year");
        });

        it("should include a group key for the folder (for use in the semantic zoom)", function () {
            expect(result.groupKey).equal("year");
        });

        it("should create an unpopolated property `firstItemIndexHint`", function () {
            // We expect this property to be populated with
            // a value after the initial conversion because
            // we don't have enough information to do so
            // at the time.
            expect(result.firstItemIndexHint).null;
        });
    });

    describe("when requesting the total count of folders", function () {

        var result;

        beforeEach(function (done) {
            adapter
                .getCount()
                .then(function (value) {
                    result = value;
                    done();
                });
        });

        it("should request the value from the underlying folder", function () {
            expect(result).equal(itemsInFolder);
        });

        it("should cache the total count on the adapter", function () {
            expect(adapter.totalCount).equal(itemsInFolder);
        });
    });

    describe("when requesting items by key", function () {

        var result = { /* We'll cache result here for comparison later. */ };
        var countBefore = 3;
        var countAfter = 5;
        var groupIndex = 77;

        beforeEach(function (done) {

            adapter.itemsFromIndex = function (index, before, after) {
                result.index = index;
                result.before = before;
                result.after = after;

                // This does not reflect the actual expected output
                // of this function.
                return WinJS.Promise.as(result);
            };

            adapter.cache.byKey["month year"] = groupIndex;

            adapter
                .itemsFromKey("month year", countBefore, countAfter)
                .then(function (value) { done(); });
        });

        it("should delegate to `itemsFromIndex()` using the cached index for the key", function () {
            expect(result.index).equal(groupIndex);
        });

        it("should delegate to `itemsFromIndex()` passing along the arguments", function () {
            expect(result.before).equal(countBefore);
            expect(result.after).equal(countAfter);
        });
    });

    describe("when requesting items by index", function () {

        var result;
        var totalCount = 22;

        function request(requestedIndex, before, after, done) {
            adapter.totalCount = totalCount;

            adapter
                .itemsFromIndex(requestedIndex, before, after)
                .then(function (value) {
                    result = value;
                    done();
                });
        }

        describe("the final result", function () {

            beforeEach(function (done) {
                request(0, 0, 0, done);
            });

            it("should include the total count ", function () {
                expect(result.totalCount).equal(totalCount);
            });
        });

        describe("for just the 1st item", function () {

            beforeEach(function (done) {
                request(0, 0, 0, done);
            });

            it("should report an absolute index of 0", function () {
                expect(result.absoluteIndex).equal(0);
            });

            it("should report an offset of 0", function () {
                expect(result.offset).equal(0);
            });

        });

        describe("for the 3rd item and 1 after", function () {

            beforeEach(function (done) {
                request(2, 0, 1, done);
            });

            it("should report an absolute index of 2", function () {
                expect(result.absoluteIndex).equal(2);
            });

            it("should report an offset of 0", function () {
                expect(result.offset).equal(0);
            });

        });

        describe("when requesting the 3rd item and 1 before and 1 after", function () {

            beforeEach(function (done) {
                request(2, 1, 1, done)
            });

            it("should report an absolute index of 1", function () {
                expect(result.absoluteIndex).equal(1);
            });

            it("should report an offset of 1", function () {
                expect(result.offset).equal(1);
            });

        });

    });

});