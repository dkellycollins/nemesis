///<reference path="../../lib/lodash/lodash.d.ts" />

import logger = require("util/logger/consoleLogger");

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
}

export = canvas;
