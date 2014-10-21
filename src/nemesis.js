define(["require", "exports", "./_nemesis", "./rendering/rendering", "./util/util"], function(require, exports, _nemesis, Rendering, Util) {
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.animate = _nemesis.animate;
        nemesis.rendering = Rendering;
        nemesis.util = Util;

        if (_nemesis.config().fullscreen) {
            _nemesis.canvas().width = window.innerWidth;
            _nemesis.canvas().height = window.innerHeight;
        }
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});
