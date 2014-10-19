define(["require", "exports", "_nemesis", "rendering/rendering", "util/math/matrix"], function(require, exports, _nemesis, Rendering, Matrix) {
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.animate = _nemesis.animate;
        nemesis.rendering = Rendering;
        nemesis.matrix = Matrix;

        if (_nemesis.config().fullscreen) {
            _nemesis.canvas().width = window.innerWidth;
            _nemesis.canvas().height = window.innerHeight;
        }
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});
