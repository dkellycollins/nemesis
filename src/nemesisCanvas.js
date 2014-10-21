define(["require", "exports", "./nemesisConfig"], function(require, exports, config) {
    var canvas;
    if (config.canvasId) {
        canvas = document.getElementById(config.canvasId);
    } else {
        canvas = document.getElementsByTagName('canvas')[0];
    }

    if (config.fullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    
    return canvas;
});
