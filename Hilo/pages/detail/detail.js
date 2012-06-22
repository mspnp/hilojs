(function () {
    'use strict';

    console.log('detail script loading');

    WinJS.UI.Pages.define('/pages/detail/detail.html', {

        ready: function (element, image) {

            if (!image || !image.url) {
                //todo: why would these not exist?
                debugger;
            }

            //todo: the item.url is for the thumb, we need to retrieve the real image

            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            img.src = image.url;
            section.appendChild(img);

            var elements = document.querySelectorAll('section');
            WinJS.UI.Animation.fadeIn(section);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name='element' domElement='true' />
            /// <param name='viewState' value='Windows.UI.ViewManagement.ApplicationViewState' />
            /// <param name='lastViewState' value='Windows.UI.ViewManagement.ApplicationViewState' />

            // TODO: Respond to changes in viewState.
            debugger;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    });
})();
