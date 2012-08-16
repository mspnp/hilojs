describe("The data adapter from the month group members", function () {
    "use strict";

    var adapter;
    var someItemDate;

    beforeEach(function () {

        someItemDate = new Date("Jan 1, 1975");

        var query = {
            // Calling `execute` on our mock query
            // will return some fake files.
            execute: function (start, count) {
                return WinJS.Promise.as([{
                    name: "filename",
                    itemDate: someItemDate,
                    otherStuff: "some additional data"
                }, {}, {}]);
            },

            // `fileQuery` represents the underlying 
            // `StorageFileQueryFile` used by the query
            // builder.
            fileQuery: {
                getItemCountAsync: function () {
                    return WinJS.Promise.as(99);
                }
            }
        }

        var identifyMonthGroup = function (date) {
            return someItemDate.toDateString();
        };

        adapter = new Hilo.month.MembersDataAdapter(query, identifyMonthGroup);
    });

    describe("when requesting items by index", function () {

        var result;
        var totalCount = 3;

        function request(requestedIndex, before, after, done) {

            adapter.totalCount = totalCount;

            adapter
                .itemsFromIndex(requestedIndex, before, after)
                .then(function (value) {
                    result = value;
                    done();
                });
        }

        describe("for each item returned", function () {

            beforeEach(function (done) {
                request(0, 0, 0, done);
            });

            it("should provide a key from the filename", function () {
                var key = result.items[0].key;
                expect(key).equal("filename");
            });

            it("should provide a group key derived from the itemDate", function () {
                // This test just confirms that we are using the itemDate
                // to determine the groupKey. It does not reflect _how_
                // we are actually deriving the groupKey.
                var groupKey = result.items[0].groupKey;
                expect(groupKey).equal(someItemDate.toDateString());
            });

            it("should provide a data property encapsulatting the data to be bound", function () {
                var data = result.items[0].data;
                expect(data.name).equal("filename");
                expect(data.otherStuff).equal("some additional data");
            });
        });

        describe("the final result", function () {
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

    describe("when requesting the total count of items", function () {

        var result;

        beforeEach(function (done) {
            adapter
                .getCount()
                .then(function (value) {
                    result = value;
                    done();
                });
        });

        it("should request the value from the underlying fileQuery", function () {
            expect(result).equal(99);
        });

        it("should cache the total count on the adapter", function () {
            expect(adapter.totalCount).equal(99);
        });
    });

});