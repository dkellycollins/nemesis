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

    var gl = canvas.getContext('experimental-webgl', {antialias:true});
    nemesis.CANVAS = canvas;
    nemesis.GL = gl;

    options.run(canvas, gl);
};