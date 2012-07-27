describe('hub view coordinator', function () {
    'use strict';

    var hubView, nav, appBar, listView;

    beforeEach(function () {
        nav = {
            navigate: function () {
                nav.navigate.args = arguments;
                nav.navigate.wasCalled = true;
            }
        };

        appBar = {
            show: function () {
                appBar.show.wasCalled = true;
            },
            hide: function () {
                appBar.hide.wasCalled = true;
            },
            enableButtons: function () {
                appBar.enableButtons.wasCalled = true;
            },
            disableButtons: function () {
                appBar.disableButtons.wasCalled = true;
            },

            handlers: {},
            addEventListener: function (name, handler) {
                this.handlers[name] = handler;
            },

            dispatchEvent: function (name, args) {
                this.handlers[name](args);
            }
        };

        listView = {
            handlers: {},
            addEventListener: function (name, handler) {
                this.handlers[name] = handler;
            },

            dispatchEvent: function (name, args) {
                this.handlers[name](args);
            }
        };

        hubView = new Hilo.Hub.HubViewCoordinator(nav, appBar, listView);
        hubView.start();
    });

    describe('given nothing is selected, when selecting a picture', function () {

        beforeEach(function () {
            listView.dispatchEvent('selectionChanged', { hasItemSelected: true });
        });

        it('should reveal the appbar', function () {
            expect(appBar.show.wasCalled).equals(true);
        });

        it('should enable the crop & rotate buttons', function () {
            expect(appBar.enableButtons.wasCalled).equals(true);
        });

    });

    describe('when a picture is selected and deselecting it', function () {

        beforeEach(function () {
            listView.dispatchEvent('selectionChanged',{ hasItemSelected: true });
            listView.dispatchEvent('selectionChanged', { hasItemSelected: false });
        });

        it('should hide the appbar', function () {
            expect(appBar.hide.wasCalled).equals(true);
        });

        it('should disable the crop & rotate button', function () {
            expect(appBar.disableButtons.wasCalled).equals(true);
        });

    });

    describe('when a picture is selected and selecting another', function () {

        beforeEach(function () {
            listView.dispatchEvent('selectionChanged', { hasItemSelected: true });
            listView.dispatchEvent('selectionChanged', { hasItemSelected: true });
        });

        it('should reveal the appbar', function () {
            expect(appBar.show.wasCalled).equals(true);
        });

        it('should enable the crop & rotate buttons', function () {
            expect(appBar.enableButtons.wasCalled).equals(true);
        });

    });

    describe('when a picture is invoked (touched or clicked)', function () {

        beforeEach(function () {
            listView.dispatchEvent('itemInvoked', { itemIndex: 99 });
        });


        it('should navigate to the detail page', function () {
            expect(nav.navigate.args[0]).equals('/Hilo/detail/detail.html');
        });

        it('should pass along the index of the selected picture', function () {
            expect(nav.navigate.args[1]).equal(99);
        });
    });


});