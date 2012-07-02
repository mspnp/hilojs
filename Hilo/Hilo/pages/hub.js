define('Hilo.pages.hub', function (require) {
    'use strict';

    var // WinJS
        ui = require('WinJS.UI'),
        nav = require('WinJS.Navigation'),
        pages = require('WinJS.UI.Pages'),
        // Hilo
        repo = require('Hilo.PicturesRepository');

    function handleMenu(item) {
        // just thining about ways to reduce wiring code
        //nav.navigate('/pages/monthView/monthView.html');
    }

    function setupFlyout() {
        var header = document.querySelector('.titlearea'),
            items = document.querySelectorAll('#navFlyout button');

        Array.prototype.forEach.call(items, function (x) {
            x.addEventListener('click', function () {
                handleMenu(x);
            });
        });

        header.addEventListener('click', function () {
            var flyout = document.getElementById('navFlyout').winControl;
            flyout.anchor = header;
            flyout.placement = 'bottom';
            flyout.alignment = 'left';
            flyout.show();
        }, false);
    }

    var page = {
        ready: function (element, options) {

            setupFlyout();

            repo.getPreviewImages().then(function (items) {

                var hub = document.querySelector('section[role="main"] ol'),
                    template = document.querySelector('#hub-image-template').winControl;

                items.forEach(function (item, index) {

                    //item.onthumbnailupdated = function () {
                    //    var el = document.querySelector('[data-item-name="' + item.name + '"]');
                    //    el.setAttribute('style', 'background-image:url("' + URL.createObjectURL(item.thumbnail) + '")');
                    //};

                    var li = document.createElement('li');
                    hub.appendChild(li);
                    template.render({
                        name: item.name,
                        url: 'url("' + URL.createObjectURL(item.thumbnail) + '")'
                    }, li).then(function (el) {
                        el.addEventListener('click', function () {
                            ui.Animation.pointerDown(el).then(function () {
                                //todo: we could pass along the query itself
                                nav.navigate('/Hilo/pages/detail.html', item);
                            });
                        });
                    });

                    //img.setAttribute('data-item-name', item.name);
         
                });
            }).then(function () {
                var elements = document.querySelectorAll('.titlearea, li');
                ui.Animation.enterPage(elements);
            });
        }
    };

    pages.define('/Hilo/pages/hub.html', page);
    return page;
});