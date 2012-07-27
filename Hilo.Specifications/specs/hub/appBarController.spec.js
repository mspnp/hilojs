describe('app bar controller', function () {
    
    var appBarController, el, button;

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

        appBarController = new Hilo.Hub.AppBarController(el);
    });

    describe('given the app bar is shown and buttons are enabled, when clicking a button', function () {
        var cropTriggered;

        beforeEach(function () {
            appBarController.addEventListener('crop', function () {
                cropTriggered = true;
            });

            button.dispatchEvent('click', { currentTarget: { id: 'crop' } });
        });

        it('should dispatch the event for that button', function () {
            expect(cropTriggered).equals(true);
        });
    });
});