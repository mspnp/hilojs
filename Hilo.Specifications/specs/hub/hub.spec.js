// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("The hub view presenter", function () {
    "use strict";

    var promise = WinJS.Promise;
    var hubPageUrl = "/Hilo/hub/hub.html";

    beforeEach(function (done) {
        WinJS.Navigation.navigate(hubPageUrl);
        setTimeout(done, 700);
    });

    describe("when activated", function () {

        it("should display images from the picture library", function () {
            var item = document.querySelector(".thumbnail");
            expect(item.style.backgroundImage).match(/url\("blob:.*"\)/);
        });
    });

});