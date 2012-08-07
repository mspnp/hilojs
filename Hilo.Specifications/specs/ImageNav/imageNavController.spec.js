describe('image nav controller', function () {
    
    var controller, el, button;

    beforeEach(function () {
        button = {
            handlers: {},
            addEventListener: function (type, handler) {
                this.handlers[type] = handler;
            },
            dispatchEvent: function (type, args) {
                this.handlers[type](args);
            }
        };

        el = {
            winControl: {},
            querySelectorAll: function () {
                return [button];
            }
        };

        controller = new Hilo.Controls.ImageNav.ImageNavController(el);
    });

    describe('given the image nav is shown and buttons are enabled, when clicking a button', function () {
        var cropTriggered;

        beforeEach(function () {
            controller.addEventListener('crop', function () {
                cropTriggered = true;
            });

            button.dispatchEvent('click', { currentTarget: { id: 'crop' } });
        });

        it('should dispatch the event for that button', function () {
            expect(cropTriggered).equals(true);
        });
    });
});