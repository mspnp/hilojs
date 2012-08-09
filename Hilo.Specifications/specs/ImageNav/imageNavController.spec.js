describe("image nav controller", function () {
    
    var controller, el, crop, rotate, nav;
    var EventClass = WinJS.Class.mix(function () { }, { winControl: {} }, WinJS.Utilities.eventMixin);

    beforeEach(function () {
        nav = {
            navigate: function () {
                nav.navigate.args = arguments;
                nav.navigate.wasCalled = true;
            }
        };

        crop = new EventClass();
        rotate = new EventClass();

        el = {
            winControl: {
                show: function () { },
                hide: function () { }
            },
            querySelector: function (selector) {
                if (selector === "#rotate") {
                    return rotate;
                } else {
                    return crop;
                }
            }
        };

        controller = new Hilo.Controls.ImageNav.ImageNavController(el, nav);
    });

    describe("given an image is selected, when clicking crop", function () {
        var cropTriggered;

        beforeEach(function () {
            controller.setImageIndex(1);
            crop.dispatchEvent("click");
        });

        it("should navigate to the crop page", function () {
            expect(nav.navigate.args[0]).equals("/Hilo/crop/crop.html");
        });

        it("should include the selected image index in the navigation args", function () {
            expect(nav.navigate.args[1]).equals(1);
        });
    });

    describe("given an image is selected, when clicking rotate", function () {
        var cropTriggered;

        beforeEach(function () {
            controller.setImageIndex(2);
            rotate.dispatchEvent("click");
        });

        it("should navigate to the crop page", function () {
            expect(nav.navigate.args[0]).equals("/Hilo/rotate/rotate.html");
        });

        it("should include the selected image index in the navigation args", function () {
            expect(nav.navigate.args[1]).equals(2);
        });
    });

});