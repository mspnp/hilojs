// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    function define(pageId, members) {

        var url = "/Hilo/" + pageId + "/" + pageId + ".html";

        members.ready = wrapWithDefaultReady(members.ready);
        members.bindPageTitle = bindPageTitle;

        return WinJS.UI.Pages.define(url, members);
    }

    function bindPageTitle(title) {
        // bind the title based on the query's month/year
        var pageTitleEl = document.querySelector("#pageTitle");
        WinJS.Binding.processAll(pageTitleEl, { title: title });
    }

    // Examines the page for `a` tags, extracting the url and wiring
    // a handler that invokes the built-in navigation logic.
    function processLinks() {
        //TODO: We should discuss how to define the application flow,
        // We might not want to hard code links into the markup.

        var links = document.querySelectorAll("a");
        Array.prototype.forEach.call(links, function (a) {
            var root = "ms-appx://" + a.host,
                url = a.href.replace(root, "");

            a.href = "#";
            a.addEventListener("click", function (args) {
                args.preventDefault();
                WinJS.Navigation.navigate(url);
            });
        });
    }

    // Takes the `ready` function that the developer provided for a page 
    // control and wraps it with additional functionality that we want to
    // occur on every page.
    function wrapWithDefaultReady(customReady) {

        customReady = customReady || function () { };

        return function (element, options) {

            processLinks();

            // Handle localized string resources for the page
            WinJS.Resources.processAll();

            // Ensure that the `options` argument is consistent with expectations,
            // for example, that it is properly deserialized when resuming.
            Hilo.controls.checkOptions(options);

            // We need to bind the `customReady` function explicitly, otherwise it will 
            // lose the context that the developer expects (that is, it will not 
            // resolve `this` correctly at execution time.
            var ready = customReady.bind(this);

            // Invoke the custom `ready`
            return ready(element, options);
        };
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.controls.pages", {
        define: define
    });

}());
