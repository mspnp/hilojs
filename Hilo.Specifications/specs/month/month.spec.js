//TODO: fix these specs. the `month.js` file is looking for DOM elements that don't exist at test time.

xdescribe("The month page control", function () {
    "use strict";

    var page;

    beforeEach(function () {
        page = new Hilo.month.pageControl();
        page.ready = function () { }; // We don't want the `ready` function to be invoked.
        page.navigate = function () { };
        page.queryBuilder = new Hilo.ImageQueryBuilder();
        page.targetFolder = {
            createFileQueryWithOptions: function () { return {}; },
            createFolderQueryWithOptions: function () { return {}; }
        };
    });

    describe("when an image is invoked", function () {

        var result = {};
        var absoluteIndex = 100;
        var firstIndexForGroup = 99;

        beforeEach(function (done) {

            // The output of invoking an image is passed to the
            // navigate function.
            page.navigate = function (url, options) {
                result.url = url;
                result.options = options;
            };

            // In order to avoid local culture settings in the unit tests,
            // we replace `getMonthYearFrom` with a simplified yet
            // predictable version.
            page.getMonthYearFrom = function (date) {
                return date.toUTCString();
            };

            page.monthGroups = {
                getFirstIndexForGroup: function (groupKey) {
                    return firstIndexForGroup = firstIndexForGroup;
                }
            };

            var item = {
                index: absoluteIndex,
                data: {
                    itemDate: new Date("Jan 1, 1975")
                }
            };

            var detail = {
                itemPromise: WinJS.Promise.as(item)
            };

            page._imageInvoked({ detail: detail })
                .then(function () { done(); });
        });

        it("should pass a query based on the item date", function () {
            expect(result.options.query.settings.monthAndYear).equal("Wed, 1 Jan 1975 08:00:00 UTC");
        });

        it("should navigate to the detail page", function () {
            expect(result.url).equal("/Hilo/detail/detail.html");
        });

        it("should include the image's index relative to it's group", function () {
            expect(result.options.itemIndex).equal(1);
        });
    });

});