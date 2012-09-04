// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================


// The code in this file originated from the Visual Studio template. On the whole,
// we have limited modifications to the file.
//
// Notable modifications include:
//
// * aliasing frequently used objects and long reference chains
// * changing the namespace to Hilo
// * wiring events using `addEventListener` instead of using the "DOM0" style

(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var displayProps = Windows.Graphics.Display.DisplayProperties;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    WinJS.Namespace.define("Hilo", {
        PageControlNavigator: WinJS.Class.define(

            // Define the constructor function for the PageControlNavigator.
            function PageControlNavigator(element, options) {
                var body = document.body;

                this.element = element || document.createElement("div");
                this.element.appendChild(this._createPageElement());

                this.home = options.home;
                this.lastViewstate = appView.value;

                nav.onnavigated = this._navigated.bind(this);
                window.onresize = this._resized.bind(this);

                body.addEventListener("keyup", this._keyupHandler.bind(this));
                body.addEventListener("keypress", this._keypressHandler.bind(this));
                body.addEventListener("mspointerup", this._mspointerupHandler.bind(this));

                this.reload = this.reload.bind(this);
                Hilo.navigator = this;
            }, {
                /// <field domElement="true" />
                element: null,
                home: "",
                lastViewstate: 0,

                // This function creates a new container for each page.
                _createPageElement: function () {
                    var element = document.createElement("div");
                    element.style.width = "100%";
                    element.style.height = "100%";
                    return element;
                },

                // This function responds to keypresses to only navigate when
                // the backspace key is not used elsewhere.
                _keypressHandler: function (args) {
                    if (args.key === "Backspace") {
                        nav.back();
                    }
                },

                // This function responds to keyup to enable keyboard navigation.
                _keyupHandler: function (args) {
                    if ((args.key === "Left" && args.altKey) || (args.key === "BrowserBack")) {
                        nav.back();
                    } else if ((args.key === "Right" && args.altKey) || (args.key === "BrowserForward")) {
                        nav.forward();
                    }
                },

                _mspointerupHandler: function (args) {
                    if (args.button === 3) {
                        nav.back();
                    } else if (args.button === 4) {
                        nav.forward();
                    }
                },

                // This function responds to navigation by adding new pages
                // to the DOM.
                _navigated: function (args) {
                    var that = this;
                    var oldElement = that.pageElement;
                    var newElement = that._createPageElement();
                    var parentedComplete;
                    var parented = new WinJS.Promise(function (c) { parentedComplete = c; });

                    args.detail.setPromise(
                        WinJS.Promise.timeout().then(function () {
                            if (oldElement.winControl && oldElement.winControl.unload) {
                                oldElement.winControl.unload();
                            }
                            return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
                        }).then(function parentElement(control) {
                            that.element.appendChild(newElement);
                            that.element.removeChild(oldElement);
                            oldElement.innerText = "";
                            that.navigated();
                            parentedComplete();
                        })
                    );
                },

                _resized: function (args) {
                    if (this.pageControl && this.pageControl.updateLayout) {
                        this.pageControl.updateLayout.call(this.pageControl, this.pageElement, appView.value, this.lastViewstate);
                    }
                    this.lastViewstate = appView.value;
                },

                // This function updates application controls once a navigation
                // has completed.
                navigated: function () {
                    // Do application specific on-navigated work here
                    var backButton = this.pageElement.querySelector("header[role=banner] .win-backbutton");
                    if (backButton) {
                        backButton.onclick = function () { nav.back(); };

                        if (nav.canGoBack) {
                            backButton.removeAttribute("disabled");
                        } else {
                            backButton.setAttribute("disabled", "disabled");
                        }
                    }
                },

                // This is the PageControlNavigator object.
                pageControl: {
                    get: function () { return this.pageElement && this.pageElement.winControl; }
                },

                // This is the root element of the current page.
                pageElement: {
                    get: function () { return this.element.firstElementChild; }
                },

                reload: function () {
                    var current = WinJS.Navigation;
                    var args = {
                        detail: {
                            location: current.location,
                            state: current.state,
                            setPromise: function (promise) {
                                this.promise = promise;
                            }
                        }
                    };
                    this._navigated(args);

                    args.detail.promise.done();
                }
            }
        )
    });
})();
