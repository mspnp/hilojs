//TODO: re-write these specs to run in Mocha, instead of Jasmine
xdescribe("The view model for a picture", function () {
    "use strict";

    var viewmodel;
    var file;

    beforeEach(function () {

        file = {
            name: "my-image",
            thumbnail: new Blob(),
            addEventListener: function () {
            }
        };

        viewmodel = new Hilo.Picture(file);
    });

    it("should have the same name as the underlying file", function () {
        expect(viewmodel.name).toBe(file.name);
    });

    it("should have a url pointing to a blob url", function () {
        expect(viewmodel.url).toMatch(/url\(blob:[\dA-F]{8}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{12}\)/);
    });

    describe("when the underlying thumbnail is not present", function () {

        beforeEach(function () {
            file.thumbnail = null;
            viewmodel = new Hilo.Picture(file);
        });

        it("should set the thumbnail url to an empty string", function () {
            expect(viewmodel.url).toBe("");
        });
    });

    describe("when the underlying thumbnail changes", function () {

        var initial_thumbnail,
            executed_binding = 0;

        beforeEach(function () {
            var update_thumb;

            file.addEventListener = function (type, handler) {
                if (type === "thumbnailupdated")
                    update_thumb = handler;
            };

            viewmodel = new Hilo.Picture(file);
            initial_thumbnail = viewmodel.url;

            viewmodel.bind("url", function () {
                executed_binding++;
            });

            update_thumb();
        });

        it("should change the thumbnail url", function () {
            expect(viewmodel.url).toNotBe(initial_thumbnail);
        });

        it("should execute the binding again after the thumbnail changes", function () {
            expect(executed_binding).toBe(2);
        });
    });

    describe("when using the convenience method for contructing a view model", function () {
        beforeEach(function () {
            viewmodel = Hilo.Picture.from(file);
        });

        it("should have the same name as the underlying file", function () {
            expect(viewmodel.name).toBe(file.name);
        });

        it("should have a url pointing to a blob url", function () {
            expect(viewmodel.url).toMatch(/url\(blob:[\dA-F]{8}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{4}-[\dA-F]{12}\)/);
        });
    });

});