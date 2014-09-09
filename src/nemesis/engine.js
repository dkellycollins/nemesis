var nemesis = nemesis || {};

nemesis.start = function(options) {
    var canvas = (!!options.canvasId) ?
        document.getElementById(options.canvasId) :
        document.getElementsByTagName('canvas')[0];

    if(!canvas) {
        return false;
    }

    if(options.fullscreen) {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    }

    try {
        var gl = canvas.getContext('experimental-webgl', {antialias:true});
        nemesis.CANVAS = canvas;
        nemesis.GL = gl;
    } catch(e) {
        return false;
    }

    nemesis.rendering.shaders.init();
    nemesis.resources.cube.init();
    nemesis.rendering.camera.init();
    nemesis.rendering.renderer.init();
    nemesis.rendering.renderer.render();
};
