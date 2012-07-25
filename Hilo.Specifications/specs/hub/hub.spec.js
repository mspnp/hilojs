describe('The hub view presenter', function () {
    'use strict';

    var page;

    var mockRepository = function () {
        return {
            getPreviewImages: Shared.getImages
        }
    };

    beforeEach(function (done) {
        this.original = Hilo.imageRespository;
        Hilo.ImageRespository = mockRepository;

        WinJS.Navigation.navigate('/Hilo/hub/hub.html');
        page = WinJS.UI.Pages.get('/Hilo/hub/hub.html');

        setTimeout(done, 500);
    });

    afterEach(function () {
        Hilo.ImageRespository = this.original;
    });

    describe('when activated', function () {

        beforeEach(function () {

        });

        it('should display images from the picture library', function () {
            debugger;
        });
    });

    //describe('when no picture is selected', function () {

    //    var handlers = {},
    //        hub;

    //    beforeEach(function () {

    //    });

    //    it('should hide the appbar', function () {

    //    });

    //    it('should disable the rotate button', function () {

    //        var btn = mock.winControl('rotate', { disabled: false });

    //        handlers['selectionchanged']();

    //        expect(btn.disabled).toBeTruthy();
    //    });

    //    it('should disable the crop button', function () {

    //        var btn = mock.winControl('crop', { disabled: false });

    //        handlers['selectionchanged']();

    //        expect(btn.disabled).toBeTruthy();
    //    });
    //});

    //describe('when a picture is selected', function () {

    //    var handlers = {},
    //        hub;

    //    beforeEach(function () {

    //        mock.winControl('picturesLibrary',
    //            {
    //                layout: {},
    //                selection: { getIndices: function () { return [0 /* a single item */] } },
    //                addEventListener: function (type, handler) {
    //                    handlers[type] = handler;
    //                }
    //            });

    //        hub = Hilo.hub(mock.require);
    //        hub.ready();
    //    });

    //    it('should reveal the appbar', function () {

    //        var revealed = false;
    //        appbar.show = function () { revealed = true; },

    //         handlers['selectionchanged']();

    //        expect(revealed).toBeTruthy();
    //    });

    //    it('should enable the rotate button', function () {

    //        var btn = mock.winControl('rotate', { disabled: true });

    //        handlers['selectionchanged']();

    //        expect(btn.disabled).toBeFalsy();
    //    });

    //    it('should enable the crop button when a picture is selected', function () {

    //        var btn = mock.winControl('crop', { disabled: true });

    //        handlers['selectionchanged']();

    //        expect(btn.disabled).toBeFalsy();
    //    });
    //});

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