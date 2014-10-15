define(["require", "exports", "_nemesis", 'rendering/rendering'], function(require, exports, _nemesis, Rendering) {
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.animate;
        nemesis.rendering;

        if (_nemesis.config().fullscreeen) {
            _nemesis.canvas().width = window.innerWidth;
            _nemesis.canvas().height = window.innerHeight;
        }

        nemesis.animate = _nemesis.animate;
        nemesis.rendering = Rendering;
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});
//# sourceMappingURL=nemesis.js.map
