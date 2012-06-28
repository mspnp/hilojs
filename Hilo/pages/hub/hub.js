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
        nav.navigate('/pages/monthView/monthView.html');
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
                var hub = document.querySelector('section[role="main"] ol');

                //todo: how can this be more declarative?
                items.forEach(function (item, index) {

                    item.onthumbnailupdated = function () {
                        var el = document.querySelector('[data-item-name="' + item.name + '"]');
                        el.setAttribute('style', 'background-image:url("' + URL.createObjectURL(item.thumbnail) + '")');
                    };

                    var li = document.createElement('li');
                    var img = document.createElement('div');

                    //var selectionMark = document.createElement('div');
                    //selectionMark.innerHTML = '&#xE081;';
                    //selectionMark.style.display = 'none';
                    //img.appendChild(selectionMark);

                    img.setAttribute('data-item-name', item.name);
                    img.alt = item.name;
                    img.setAttribute('style', 'background-image:url("' + URL.createObjectURL(item.thumbnail) + '")');

                    li.appendChild(img);
                    hub.appendChild(li);

                    li.addEventListener('click', function () {
                        ui.Animation.pointerDown(img).then(function () {
                            //todo: we could pass along the query itself
                            nav.navigate('/pages/detail/detail.html', item);
                        });

                        //img.style.transform = "translate(0px, 100px)";
                        //img.style.transform = "translate(0px, 100px)";
                        
                        //ui.Animation.swipeSelect(img, selectionMark);

                        //selectionMark.style.display = "inherit";
                    });
                });
            }).then(function () {
                var elements = document.querySelectorAll('.titlearea, li');
                ui.Animation.enterPage(elements);
            });
        }
    };

    pages.define('/pages/hub/hub.html', page);
    return page;
});