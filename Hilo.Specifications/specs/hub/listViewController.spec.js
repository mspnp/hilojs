describe('listview controller', function () {
    'use strict';

    describe('when snapped', function () {

        var el;

        beforeEach(function () {
            var appView = {};
            el = {
                winControl: {
                    addEventListener: function () { }
                }               
            };

            var listviewController = new Hilo.Hub.ListViewController(el, appView);
            listviewController.setViewState(Windows.UI.ViewManagement.ApplicationViewState.snapped);
        });

        it('the ListView should use a ListLayout', function () {
            expect(el.winControl.layout instanceof WinJS.UI.ListLayout).equal(true);
        });

    });

    describe('when filled', function () {

        var el;

        beforeEach(function () {
            var appView = {};
            el = {
                winControl: {
                    addEventListener: function () { }
                }
            };

            var listviewController = new Hilo.Hub.ListViewController(el, appView);
            listviewController.setViewState(Windows.UI.ViewManagement.ApplicationViewState.filled);
        });

        it('the ListView should use a GridLayout', function () {
            expect(el.winControl.layout instanceof WinJS.UI.GridLayout).equal(true);
        });

        it('the ListView should limit to 3 rows', function () {
            expect(el.winControl.layout.maxRows).equal(3);
        });

        it('the ListView should enable cell spanning', function () {
            var groupInfo = el.winControl.layout.groupInfo();
            expect(groupInfo.enableCellSpanning).equal(true);
        });

        it('the ListView should size cells to 200 x 200', function () {
            var groupInfo = el.winControl.layout.groupInfo();
            expect(groupInfo.cellWidth).equal(200);
            expect(groupInfo.cellHeight).equal(200);
        });

    });

});