///<reference path="../lib/lodash/lodash.d.ts" />
///<reference path="nemesisConfig.d.ts" />

import config = require("json!config.json");
import _ = require("lodash");

_.defaults(config, {
    canvasId: "",
    fullscreen: false,
    throwOnGLError: true,
    logGLCalls: false,
    validateGLArgs: true
});

export = config;