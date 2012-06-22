describe('The hub view presenter', function () {
    'use strict';

    var
        pages = {},
        async = { it: Hilo.specs.helpers.async },
        mock;

    beforeEach(function () {
        mock = new Hilo.specs.helpers.mocking().handle;
        mock('Hilo.PicturesRepository', {});

        mock('WinJS.UI.Pages', {
            define: function (url, page) {
                pages[url] = page;
            }
        });
    });

    it('should be defined as a page', function () {
        expect(pages['/pages/hub/hub.html']).toBeUndefined();
        Hilo.pages.hub(mock.require);
        expect(pages['/pages/hub/hub.html']).toBeDefined();
    });

    it('should define a ready function', function () {
        var page = Hilo.pages.hub(mock.require);
        expect(page.ready).toBeDefined();
    });

    it('should request preview images when ready', function () {
        var ready = false;

        mock.dom('<div class="titlearea"></div>');

        runs(function () {
            mock('Hilo.PicturesRepository', {
                getPreviewImages: function () {
                    ready = true;
                    return WinJS.Promise.wrap([]);
                }
            });
            var page = Hilo.pages.hub(mock.require);
            page.ready();
        });

        waitsFor(function () {
            return ready;
        });
    });
});