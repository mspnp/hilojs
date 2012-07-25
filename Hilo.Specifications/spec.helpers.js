(function () {
    'use strict';

    var utilities = WinJS.Utilities;

    var scratcn_id = 'scratch',
        locateScratch = document.querySelector.bind(document, '#' + scratcn_id);

    // Clean out the scratch area and build new 
    // DOM elements based on the given html.
    function dom(html) {

        var scratch = locateScratch();

        // If the scratch area does not exist, then we create it.
        if (!scratch()) {
            scratch = createScratchArea();
        }

        utilities.empty(scratch);
        scratch.innerHTML = html;
    }

    // Create a new scratch area.
    function createScratchArea() {
        var area = document.createElement('div');
        area.id = scratcn_id;
        area.style.display = 'none';
        document.body.appendChild(area);
        return area;
    }

    WinJS.Namespace.define('Hilo.specs.helpers', {
        dom: dom
    });

})();