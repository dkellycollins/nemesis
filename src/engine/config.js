///<reference path="./nemesisConfig.d.ts" />
define(["require", "exports", './canvas'], function (require, exports, canvas) {
    var config = {};
    if (canvas.getAttribute('debug') == "true") {
        config.throwOnGLError = true;
        config.logGLCalls = true;
        config.validateGLArgs = true;
    }
    return config;
});
