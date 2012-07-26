describe('The hub view presenter', function () {
    'use strict';

    var promise = WinJS.Promise;

    var mockRepository = function () {
        return {
            getBindableImages: function () {
                return promise.wrap([{
                    name: 'some-file.jpg',
                    url: 'url("some-url")',
                    className: 'thumbnail'
                }]);
            }
        }
    };

    beforeEach(function (done) {
        this.original = Hilo.ImageRepository;
        Hilo.ImageRepository = mockRepository;

        WinJS.Navigation.navigate('/Hilo/hub/hub.html');

        setTimeout(done, 200);
    });

    afterEach(function () {
        Hilo.ImageRepository = this.original;
    });

    describe('when activated', function () {

        it('should display images from the picture library', function () {
            var item = document.querySelector('.thumbnail');
            expect(item.style.backgroundImage).equal('url("some-url")');
        });
    });

    describe('when nothing is selected and selecting a picture', function () {

        var revealed = false;

        beforeEach(function () {
            var appbar = document.querySelector('#appbar').winControl;
            appbar.show = function () { revealed = true; };

            var listView = document.querySelector('#picturesLibrary').winControl;            

            listView.selection.getIndices = function () { return [0 /* the first item is selected */] };
            listView.dispatchEvent('selectionchanged');
        });

        it('should reveal the appbar', function () {
            expect(revealed).equal(true);
        });

        it('should enable the rotate button', function () {
            var button = document.querySelector('#rotate');
            expect(button.disabled).equal(false);
        });

        it('should enable the crop button when a picture is selected', function () {
            var button = document.querySelector('#crop');
            expect(button.disabled).equal(false);
        });
    });

    describe('when a picture is selected and deselecting it', function () {

        var hidden = false;

        beforeEach(function () {
            var appbar = document.querySelector('#appbar').winControl;
            appbar.hide = function () { hidden = true; };

            var listView = document.querySelector('#picturesLibrary').winControl;

            listView.selection.getIndices = function () { return [ 0 /* the first item is selected */ ] };
            listView.dispatchEvent('selectionchanged');

            listView.selection.getIndices = function () { return [] };
            listView.dispatchEvent('selectionchanged');
        });

        it('should hide the appbar', function () {
            expect(hidden).equal(true);
        });

        it('should disable the rotate button', function () {
            var button = document.querySelector('#rotate');
            expect(button.disabled).equal(true);
        });

        it('should disable the crop button', function () {
            var button = document.querySelector('#crop');
            expect(button.disabled).equal(true);
        });
    });

    describe('when a picture is selected and selecting another', function () {

        var appbarElement;

        beforeEach(function () {
            appbarElement = document.querySelector('#appbar');

            var listView = document.querySelector('#picturesLibrary').winControl;

            listView.selection.getIndices = function () { return [0 /* the first item is selected */] };
            listView.dispatchEvent('selectionchanged');

            listView.selection.getIndices = function () { return [1 /* the second item is selected */] };
            listView.dispatchEvent('selectionchanged');
        });

        it('should show the appbar', function () {
            expect(appbarElement.style.visibility).equal('visible');
        });

        it('should enable the rotate button', function () {
            var button = document.querySelector('#rotate');
            expect(button.disabled).equal(false);
        });

        it('should enable the crop button', function () {
            var button = document.querySelector('#crop');
            expect(button.disabled).equal(false);
        });
    });

    //describe('when a picture is invoked (touched or clicked)', function () {

    //    var handlers = {},
    //        navigated_to,
    //        selected_picture_index;

    //    beforeEach(function () {

    //        mock.winControl('picturesLibrary',
    //            {
    //                layout: {},
    //                selection: { getIndices: function () { return [0 /* a single item */] } },
    //                addEventListener: function (type, handler) {
    //                    handlers[type] = handler;
    //                }
    //            });

    //        mock('WinJS.Navigation', {
    //            navigate: function (url, index) {
    //                navigated_to = url;
    //                selected_picture_index = index;
    //            }
    //        });

    //        var hub = Hilo.hub(mock.require);
    //        hub.ready();

    //        handlers['iteminvoked']({ detail: { itemIndex: 99 } });
    //    });

    //    it('should navigate to the detail page', function () {
    //        expect(navigated_to).toBe('/Hilo/detail/detail.html');
    //    });

    //    it('should pass along the index of the selected picture', function () {
    //        expect(selected_picture_index).toBe(99);
    //    });
    //});

    //describe('when snapped', function () {

    //    var listview;
    //    beforeEach(function () {
    //        listview = mock.winControl('picturesLibrary', { layout: {}, addEventListener: function (type, handler) { } });
    //        var hub = Hilo.hub(mock.require);
    //        hub.ready();
    //        hub.updateLayout(null, Windows.UI.ViewManagement.ApplicationViewState.snapped);
    //    });

    //    it('the ListView should use a ListLayout', function () {
    //        expect(listview.layout instanceof WinJS.UI.ListLayout).toBe(true);
    //    });

    //});

    //describe('when filled', function () {

    //    var listview;
    //    beforeEach(function () {
    //        listview = mock.winControl('picturesLibrary', { layout: {}, addEventListener: function (type, handler) { } });
    //        var hub = Hilo.hub(mock.require);
    //        hub.ready();
    //        hub.updateLayout(null, Windows.UI.ViewManagement.ApplicationViewState.filled);
    //    });

    //    it('the ListView should use a GridLayout', function () {
    //        expect(listview.layout instanceof WinJS.UI.GridLayout).toBe(true);
    //    });

    //    it('the ListView should limit to 3 rows', function () {
    //        expect(listview.layout.maxRows).toBe(3);
    //    });

    //    it('the ListView should enable cell spanning', function () {
    //        var groupInfo = listview.layout.groupInfo();
    //        expect(groupInfo.enableCellSpanning).toBe(true);
    //    });

    //    it('the ListView should size cells to 200 x 200', function () {
    //        var groupInfo = listview.layout.groupInfo();
    //        expect(groupInfo.cellWidth).toBe(200);
    //        expect(groupInfo.cellHeight).toBe(200);
    //    });

    //});
});