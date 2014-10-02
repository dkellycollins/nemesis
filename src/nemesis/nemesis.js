define(["require", "exports"], function(require, exports) {
    var _config;
    function config(c) {
        if (!c) {
            _config = c;
        }
        return _config || {};
    }
    exports.config = config;

    exports.GL;
    exports.CANVAS;

    if (!!exports.config().canvasId) {
        exports.CANVAS = document.getElementById(exports.config().canvasId);
    } else {
        exports.CANVAS = document.getElementsByTagName('canvas')[0];
    }

    exports.GL = exports.CANVAS.getContext("experimental-webgl", { antialias: true });
});
//# sourceMappingURL=nemesis.js.map
