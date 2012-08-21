// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    // Image Navigation Control
    // ------------------------

    // This control provides a re-usable implementation of the application"s `AppBar`
    // for navigating to the "crop" and "rotate" screens. 
    //
    // There are two important components in this control: the `ImageNav.html` file
    // which can be included in any page that needs the standard image naviagation
    // app bar, and the `imageNavController.js` which is the controller that is used
    // to facilitate the app bar"s functionality. 
    // 
    // To use this control in a page, add a reference to it in the page"s markup,
    // as an HTML control:
    //
    // ```html
    // <section id="some-id" 
    //          data-win-control="WinJS.UI.HtmlControl" 
    //          data-win-options="{uri: "/Hilo/controls/ImageNav/ImageNav.html"}">
    // </section> 
    // ```
    //
    // Then in the page"s .js file, create an instance of the ImageNavController.
    // The controller requires a reference to the HTML element that was used to
    // place the control on the screen, and a reference to WinJS.Navigation:
    //
    // ```js
    // var imageNavEl = document.querySelectory("#some-id");
    // var imageNav = new Hilo.Controls.ImageNav.ImageNavController(imageNavEl, WinJS.Navigation);
    // ```
    //
    // See the `imageNavController.js` file for more information on the API for
    // using the ImageNav controller.

    WinJS.UI.Pages.define("/Hilo/controls/ImageNav/ImageNav.html", {
    });
})();