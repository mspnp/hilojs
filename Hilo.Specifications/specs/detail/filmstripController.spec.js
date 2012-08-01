describe("film strip controller", function () {

    var filmstripController, el;

    beforeEach(function(){
        el = {
            winControl: {
                selection: {
                    getIndices: function () {
                        return [0];
                    },
                },
                handlers: {},
                addEventListener: function(type, handler){
                    this.handlers[type] = handler;
                },
                dispatchEvent: function (type, args) {
                    if (!this.handlers[type]) {
                        throw new Error("Handler for '" + type + "' not found.")
                    }
                    this.handlers[type](args);
                }
            }
        };

        filmstripController = new Hilo.Detail.FilmstripController(el);
    });

    describe("when invoking a thumbnail", function () {
        var handler = function (args) {
            handler.wasCalled = true;
            handler.args = args.detail;
        }

        beforeEach(function () {
            filmstripController.addEventListener("imageInvoked", handler);

            el.winControl.dispatchEvent("iteminvoked", {});
        });

        it("should trigger an imageInvoked event", function () {
            expect(handler.wasCalled).equals(true);
        });

        it("should tell me the index of the clicked item", function () {
            expect(handler.args.itemIndex).equals(0);
        });
    });

});