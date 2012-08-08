// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/Hilo/controls/Header/Header.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            if (options.titleResource) {
                var pageTitle = element.querySelector("#pageTitle");
                var title = WinJS.Resources.getString(options.titleResource);
                pageTitle.textContent = title.value;
            }

        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            // TODO: Respond to changes in viewState.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    });
})();
