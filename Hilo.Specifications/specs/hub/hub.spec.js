describe('The hub view presenter', function () {
    'use strict';

    var promise = WinJS.Promise;
    var hubPageUrl = '/Hilo/hub/hub.html';

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

    beforeEach(function (done) {
        this.originalRepository = Hilo.ImageRepository;
        Hilo.ImageRepository = mockRepository;

        WinJS.Navigation.navigate(hubPageUrl);

        setTimeout(done, 500);
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

});