// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    'use strict';

    var YearList = WinJS.Class.define(function YearList_ctor(element, options) {
        // <SnippetHilojs_1709>
        var listViewEl = document.createElement("div");

        element.appendChild(listViewEl);

        var listView = new WinJS.UI.ListView(listViewEl, {
            layout: { type: WinJS.UI.GridLayout },
            selectionMode: "none",
            tapBehavior: "none"
        });

        this.listView = listView;
        listView.layout.maxRows = 3;
        // </SnippetHilojs_1709>
        var self = this;
        listView.itemTemplate = function (itemPromise, recycledElement) {

            var container = recycledElement || document.createElement("div");
            container.innerHTML = "";

            var header = document.createElement("div");
            header.className = "header";
            var body = document.createElement("div");
            body.className = "body";
            container.appendChild(header);
            container.appendChild(body);
            container.className = "year-group";

            var handler = function (item, args) {
                WinJS.UI.Animation.pointerDown(this);
                self.getGroupForMonthYear(item).then(function (monthGroup) {
                    self.zoomableView._selectedItem = monthGroup;
                    self.zoomableView._triggerZoom();
                });

            };

            return itemPromise.then(function (item) {

                header.innerText = item.data.title;

                item.data.months.forEach(function (month) {

                    var d = new Date(item.data.title, month.index);
                    var name = self._dateFormatter.getAbbreviatedMonthFrom(d);
                    var m$ = document.createElement("div");

                    var span = document.createElement("span");
                    span.className = "month-name";
                    span.innerText = name;
                    m$.appendChild(span);

                    m$.className = "month-item";
                    m$.setAttribute("disabled", true);

                    body.appendChild(m$);

                    month.itemPromise.then(function (data) {
                        if (data.count > 0) {
                            m$.addEventListener("click", handler.bind(m$, data));
                            m$.removeAttribute("disabled");
                        }

                        var span = document.createElement("span");
                        span.innerText = data.count;
                        span.className = "month-count";
                        m$.appendChild(span);
                    });
                });

                return container;
            });
        };

        this.zoomableView.beginZoom = function () {
            self.listView.itemDataSource = self._dataSource;
        }

        this._initialized = false;
    },
    {
        _dateFormatter: Hilo.dateFormatter,

        setItemDataSource: function (dataSource) {
            this._dataSource = dataSource;
        },

        setLayout: function (layout) {
            this.listView.layout = layout;
        },

        getGroupForMonthYear: function (item) {
            throw new Error("`getGroupForMonthYear` should be set by the page control.");
        },

        zoomableView: {

            beginZoom: function () {
            },

            endZoom: function (isCurrentView) {
            },

            configureForZoom: function (isZoomedOut, isCurrentView, triggerZoom, prefetchedPages) {
                this._triggerZoom = triggerZoom;
            },

            getCurrentItem: function () {
                return WinJS.Promise.as({
                    item: this._selectedItem,
                    position: { left: 0, top: 0, width: 0, height: 0 }
                });
            },

            getPanAxis: function () { return "Horizontal"; },

            positionItem: function (item, position) {
            },

            handlePointer: function () { debugger; },
            setCurrentItem: function () { debugger; }
        }
    });

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.month', {
        YearList: YearList
    });

})();