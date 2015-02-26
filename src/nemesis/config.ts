///<reference path="./nemesisConfig.d.ts" />

import canvas = require('./canvas');

/**
 * Retrieves the configurations as defined by the user.
 */

var config: NemesisConfig = <NemesisConfig>{};
if((<HTMLCanvasElement>canvas).getAttribute('debug') == "true") {
    config.throwOnGLError = true;
    config.logGLCalls = true;
    config.validateGLArgs = true;
}

export = config;