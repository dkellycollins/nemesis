///<reference path="../../../lib/lodash/lodash.d.ts" />

import logger = require("../nemesis.logger/logger/consoleLogger");

/**
 * The canvas element on the page.
 * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
 */

var elements = document.getElementsByTagName('canvas');
var canvas;

if(elements.length == 0) {
    logger.logError('No canvas elements found.');
} else {
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].hasAttribute('nemesis')) {
            canvas = elements[i];
            break;
        }
    }
    canvas = canvas || elements[0];

    //Fullscreen option must be handled here
    if(canvas.getAttribute("fullscreen") == "true") {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    }
}

export = canvas;
