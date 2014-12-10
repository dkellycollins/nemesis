///<reference path="./nemesisConfig.d.ts" />
define(["require", "exports", './canvas'], function (require, exports, canvas) {
    /**
     * Retrieves the configurations as defined by the user.
     */
    var config = {};
    if (canvas.getAttribute('debug') == "true") {
        config.throwOnGLError = true;
        config.logGLCalls = true;
        config.validateGLArgs = true;
    }
    return config;
});
