describe('hub view coordinator', function () {
    'use strict';

    var hubView, nav, appBar, listView;

    beforeEach(function (done) {
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
                this.handlers[name]({ detail: args });
            }
        };

        listView = {
            handlers: {},
            addEventListener: function (name, handler) {
                this.handlers[name] = handler;
            },

            dispatchEvent: function (name, args) {
                this.handlers[name]({ detail: args });
            }
        };

        var whenFolderIsReady = Windows.Storage.ApplicationData.current.localFolder.getFolderAsync('Indexed');

        whenFolderIsReady.then(function (folder) {
            var queryBuilder = new Hilo.ImageQueryBuilder(folder);

            hubView = new Hilo.Hub.HubViewCoordinator(nav, appBar, listView, queryBuilder);
            hubView.start();
            done();
        });
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
            var item = {
                data: {
                    itemDate: new Date("Jan 5 1973")
                }
            };
            listView.dispatchEvent('itemInvoked', { item: item, itemIndex: 99 });
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