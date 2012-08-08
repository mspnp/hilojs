describe('hub view coordinator', function () {
    'use strict';

    var hubView, nav, imageNav, listView;

    var EventClass = WinJS.Class.mix(function () { }, WinJS.Utilities.eventMixin);

    beforeEach(function (done) {
        listView = new EventClass();

        nav = {
            navigate: function () {
                nav.navigate.args = arguments;
                nav.navigate.wasCalled = true;
            }
        };

        imageNav = {
            setImageIndex: function (index) {
                imageNav.setImageIndex.wasCalled = true;
                imageNav.setImageIndex.itemIndex = index;
            },

            clearImageIndex: function () {
                imageNav.clearImageIndex.wasCalled = true;
            }
        };

        var whenFolderIsReady = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync('Indexed');

        whenFolderIsReady.then(function (folder) {
            var queryBuilder = new Hilo.ImageQueryBuilder(folder);

            hubView = new Hilo.Hub.HubViewCoordinator(nav, imageNav, listView, queryBuilder);
            hubView.start();
            done();
        });
    });

    describe('given nothing is selected, when selecting a picture', function () {

        beforeEach(function () {
            listView.dispatchEvent('selectionChanged', { hasItemSelected: true, itemIndex: 1 });
        });

        it('should set the image index and show the app bar', function () {
            expect(imageNav.setImageIndex.wasCalled).equals(true);
            expect(imageNav.setImageIndex.itemIndex).equals(1);
        });

    });

    describe('when a picture is selected and deselecting it', function () {

        beforeEach(function () {
            listView.dispatchEvent('selectionChanged',{ hasItemSelected: true });
            listView.dispatchEvent('selectionChanged', { hasItemSelected: false });
        });

        it('should hide the appbar', function () {
            expect(imageNav.clearImageIndex.wasCalled).equals(true);
        });

    });

    describe('when a picture is selected and selecting another', function () {

        beforeEach(function () {
            listView.dispatchEvent('selectionChanged', { hasItemSelected: true, itemIndex: 0 });
            listView.dispatchEvent('selectionChanged', { hasItemSelected: true, itemIndex: 1 });
        });

        it('should reveal the appbar', function () {
            expect(imageNav.setImageIndex.wasCalled).equals(true);
            expect(imageNav.setImageIndex.itemIndex).equals(1);
        });

    });

    describe('when a picture is invoked (touched or clicked)', function () {

        beforeEach(function () {
            var item = {
                data: {
                    itemDate: new Date("Jan 5 1973"),
                    groupIndex: 99
                }
            };
            listView.dispatchEvent('itemInvoked', { item: item });
        });


        it('should navigate to the detail page', function () {
            expect(nav.navigate.args[0]).equals('/Hilo/detail/detail.html');
        });

        it('should pass along the index of the selected picture', function () {
            expect(nav.navigate.args[1].itemIndex).equal(99);
        });

        it('should pass along the month/year query for the invoked picture', function () {
            expect(nav.navigate.args[1].query).exist;
        });
    });

});