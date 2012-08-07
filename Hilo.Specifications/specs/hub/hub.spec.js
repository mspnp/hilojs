describe('The hub view presenter', function () {
    'use strict';

    var promise = WinJS.Promise;
    var hubPageUrl = '/Hilo/hub/hub.html';

    beforeEach(function (done) {
        WinJS.Navigation.navigate(hubPageUrl);
        setTimeout(done, 500);
    });

    describe('when activated', function () {

        it('should display images from the picture library', function () {
            var item = document.querySelector('.thumbnail');
            expect(item.style.backgroundImage).match(/url\("blob:.*"\)/);
        });
    });

});