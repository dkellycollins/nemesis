//<reference path="./nemesisConfig.d.ts" />

import canvas = require('./canvas');

var config: NemesisConfig = {};

if(canvas.getAttribute('debug') == "true") {
    config.throwOnGLError = true;
    config.logGLCalls = true;
    config.validateGLArgs = true;
}

export = config;