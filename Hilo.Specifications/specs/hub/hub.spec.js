describe('The hub view presenter', function () {
    'use strict';

    var promise = WinJS.Promise;

    function mockRepository() {
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

    function setSelectionOnListView(indices) {
        var listView = document.querySelector('#picturesLibrary').winControl;

        listView.selection.getIndices = function () { return indices };
        listView.dispatchEvent('selectionchanged');
    }

    beforeEach(function (done) {
        this.originalRepository = Hilo.ImageRepository;
        Hilo.ImageRepository = mockRepository;

        WinJS.Navigation.navigate('/Hilo/hub/hub.html');

        setTimeout(done, 200);
    });

    afterEach(function () {
        Hilo.ImageRepository = this.originalRepository;
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

            /* select the first item */
            setSelectionOnListView([0]);
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

            /* select the first item */
            setSelectionOnListView([0]);

            /* then deselect it */
            setSelectionOnListView([]);
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

            /* select the first item */
            setSelectionOnListView([0]);

            /* then select the second item */
            setSelectionOnListView([1]);
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

    describe('when a picture is invoked (touched or clicked)', function () {

        var navigated_to,
            selected_picture_index;

        beforeEach(function () {
            this.originalNavigate = WinJS.Navigation.navigate;

            WinJS.Navigation.navigate = function (location, itemIndex) {
                navigated_to = location;
                selected_picture_index = itemIndex;
            };

            var listView = document.querySelector('#picturesLibrary').winControl;
            listView.dispatchEvent('iteminvoked', { detail: { itemIndex: 99 } });
        });

        afterEach(function () {
            WinJS.Navigation.navigate = this.originalNavigate;
        });

        it('should navigate to the detail page', function () {
            expect(navigated_to).equal('/Hilo/detail/detail.html');
        });

        it('should pass along the index of the selected picture', function () {
            expect(selected_picture_index).equal(99);
        });
    });

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