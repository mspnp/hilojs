describe('hub view coordinator', function () {
    'use strict';

    var hubView, nav, appBar, listView;
    var app = WinJS.Application;

    beforeEach(function () {
        nav = {};
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
            }
        };
        listView = {};

        hubView = new Hilo.Hub.HubViewCoordinator(app, nav, appBar, listView);
        hubView.start();
    });

    describe('given nothing is selected, when selecting a picture', function () {

        beforeEach(function () {
            app.queueEvent({
                type: 'listview:selectionChanged',
                hasItemSelected: true
            });
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
            app.queueEvent({
                type: 'listview:selectionChanged',
                hasItemSelected: false
            });
        });

        it('should hide the appbar', function () {
            expect(appBar.hide.wasCalled).equals(true);
        });

        it('should disable the crop & rotate button', function () {
            expect(appBar.disableButtons.wasCalled).equals(true);
        });

    });

});