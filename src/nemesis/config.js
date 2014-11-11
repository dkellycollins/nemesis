///<reference path="../../lib/lodash/lodash.d.ts" />
///<reference path="nemesisConfig.d.ts" />
define(["require", "exports", "json!config.json", "lodash"], function(require, exports, config, _) {
    _.defaults(config, {
        canvasId: "",
        fullscreen: false,
        throwOnGLError: true,
        logGLCalls: false,
        validateGLArgs: true
    });

    
    return config;
});
