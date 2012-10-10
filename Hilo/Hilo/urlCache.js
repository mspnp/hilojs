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

    // Private Members
    // ---------------

    // Determine whether or not the specified target is a function
    function isFunction(target) {
        return (typeof target === "function");
    }

    // Return a promise that wraps a value, where the target is either an object
    // or a function. If the target is a function, execute the function and 
    // return that value through the promise. If the target is not a function,
    // return the value directl through the promise.
    function resultAsPromise(target) {
        var value;
        if (isFunction(target)) {
            value = target();
        } else {
            value = target;
        }
        return WinJS.Promise.as(value);
    }

    // URL Cache
    // ---------

    var urlCache = {
        urlList: {},

        getUrl: function (key, attrName, target) {
            var self = this;

            if (this.urlList[key] && this.urlList[key][attrName]) {
                return WinJS.Promise.as(this.urlList[key][attrName]);
            }

            var promise = new WinJS.Promise(function (complete) {
                resultAsPromise(target).then(function (obj) {
                    var urlConfig = self._buildUrlConfig(key, attrName, obj);
                    complete(urlConfig);
                });
            });

            return promise;
        },

        clear: function (key) {
            var urlConfigs, urlConfig, urlName;
            urlConfigs = this.urlList[key];
            for (urlName in urlConfigs) {
                if (urlConfigs.hasOwnProperty(urlName)) {
                    urlConfig = urlConfigs[urlName];
                    URL.revokeObjectURL(urlConfig.url);
                }
            }
        },

        clearAll: function () {
            var urlConfigs, urlName, urlConfig, attr;
            for (attr in this.urlList) {
                if (this.urlList.hasOwnProperty(attr)) {
                    urlConfigs = this.urlList[attr];
                    for (urlName in urlConfigs) {
                        if (urlConfigs.hasOwnProperty(urlName)) {
                            urlConfig = urlConfigs[urlName];
                            URL.revokeObjectURL(urlConfig.url);
                        }
                    }
                }
            }
            this.urlList = {};
        },

        _buildUrlConfig: function (key, attrName, obj) {
            var url = (obj) ? URL.createObjectURL(obj) : "";

            var config = {
                attrName: attrName,
                url: url,
                backgroundUrl: "url(" + url + ")",
            };

            if (!this.urlList[key]) {
                this.urlList[key] = {};
            }

            this.urlList[key][attrName] = config;

            return config;
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo", {
        UrlCache: urlCache
    });

})();