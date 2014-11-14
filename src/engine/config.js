///<reference path="../../lib/lodash/lodash.d.ts" />
///<reference path="nemesisConfig.d.ts" />
define(["require", "exports", "lodash"], function (require, exports, _) {
    var config = {};
    _.defaults(config, {
        canvasId: "",
        fullscreen: true,
        throwOnGLError: true,
        logGLCalls: false,
        validateGLArgs: true
    });
    return config;
});
