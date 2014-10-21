define(["require", "exports", "./rendering/rendering", "./util/util"], function(require, exports, Rendering, Util) {
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.rendering = Rendering;
        nemesis.util = Util;

        var _animate;
        ;
        function animate(animateFunc, args) {
            _animate = function (time, args) {
                animateFunc(time, args);
                window.requestAnimationFrame(function (t) {
                    _animate(t, args);
                });
            };
            window.requestAnimationFrame(function (t) {
                _animate(t, args);
            });
        }
        nemesis.animate = animate;
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});
