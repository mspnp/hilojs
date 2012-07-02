define('Hilo.pages.hub', function (require) {
    'use strict';

    var // WinJS
        ui = require('WinJS.UI'),
        nav = require('WinJS.Navigation'),
        pages = require('WinJS.UI.Pages'),
        // Hilo
        repo = require('Hilo.PicturesRepository');

    function setupAppbar() {
        var appbar = document.querySelector('#appbar').winControl,
            buttons = document.querySelectorAll('#appbar button');

        Array.prototype.forEach.call(buttons, function (x) {
            //x.winControl.disabled = true;
            x.addEventListener('click', function () {
                //handleMenu(x);
            });
        });

    }

    function animateEnterPage() {
        var elements = document.querySelectorAll('.titlearea, li');
        ui.Animation.enterPage(elements);
    }

    function bindImages(items) {
        var hub = document.querySelector('section[role="main"] ol'),
            template = document.querySelector('#hub-image-template').winControl;

        items.forEach(function (item, index) {

            var li = document.createElement('li');
            hub.appendChild(li);

            function attachClick(el) {
                el.addEventListener('click', function () {
                    ui.Animation.pointerDown(el).then(function () {
                        // TODO: we could pass along the query itself
                        nav.navigate('/Hilo/pages/detail.html', index);
                    });
                });
            }

            template.render(item, li).then(attachClick);
        });
    }

    var page = {
        ready: function (element, options) {

            setupAppbar();

            repo.getPreviewImages()
                .then(bindImages)
                .then(animateEnterPage);
        }
    };

    pages.define('/Hilo/pages/hub.html', page);
    return page;
});