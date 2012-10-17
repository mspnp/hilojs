// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    var YearList = WinJS.Class.define(function YearList_ctor(element, options) {
        var self = this;

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
                self.zoomableView._selectedItem = {
                    groupKey: item.groupKey,
                    firstItemIndexHint: item.firstItemIndexHint
                };
                self.zoomableView._triggerZoom();

            };

            return itemPromise.then(function (item) {

                header.innerText = item.data.year;

                var monthsInYear = 12;
                var month;
                for (var i = 0; i < monthsInYear; i++) {
                    month = item.data.months[i];

                    var d = new Date(item.data.year, i);
                    var name = self._dateFormatter.getAbbreviatedMonthFrom(d);
                    var m$ = document.createElement("div");

                    var span = document.createElement("span");
                    span.className = "month-name";
                    span.innerText = name;
                    m$.appendChild(span);

                    m$.className = "month-item";
                    m$.setAttribute("disabled", true);

                    body.appendChild(m$);

                    if (month) {
                        m$.addEventListener("click", handler.bind(m$, month));
                        m$.removeAttribute("disabled");
                    };
                }

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

    WinJS.Namespace.define("Hilo.month", {
        YearList: YearList
    });

})();