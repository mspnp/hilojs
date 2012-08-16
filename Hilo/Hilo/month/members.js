(function () {
    'use strict';

    // Private Methods
    // ---------------

    var DataAdapter = WinJS.Class.define(function (queryBuilder, folder, identifyMonthGroup) {

        this.query = queryBuilder
            .prefetchOptions(['System.ItemDate'])
            .bindable()
            .build(folder);

        this.totalCount;
        this.identifyMonthGroup = identifyMonthGroup;

    }, {

        itemsFromIndex: function (requestIndex, countBefore, countAfter) {
            var self = this,
                start = requestIndex - countBefore,
                count = countBefore + 1 + countAfter;

            var buildResult = this.buildResult.bind(this, countBefore, start);

            return this.query
                .execute(start, count)
                .then(buildResult);
        },

        getCount: function () {
            var self = this;
            return this.query.fileQuery
                .getItemCountAsync()
                .then(function (count) {
                    self.totalCount = count;
                    return count;
                });
        },

        buildResult: function (offset, absoluteIndex, items) {
            var convert = this.toListViewItem.bind(this);
            var result = {
                items: items.map(convert),
                offset: offset,
                absoluteIndex: absoluteIndex
            };

            if (this.totalCount) {
                result.totalCount = this.totalCount;
            }

            return result;
        },

        toListViewItem: function (model) {
            return {
                key: model.name,
                data: model,
                groupKey: this.identifyMonthGroup(model.itemDate)
            };
        }
    });

    var Members = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function (queryBuilder, folder, identifyMonthGroup) {
        this._baseDataSourceConstructor(new DataAdapter(queryBuilder, folder, identifyMonthGroup));
    });

    // Export Public API
    // -----------------

    WinJS.Namespace.define('Hilo.month', {
        Members: Members
    });

})();