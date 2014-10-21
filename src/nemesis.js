define(["require", "exports"], function(require, exports) {
    /*import Rendering = require("./rendering/rendering");
    import Util = require("./util/util");*/
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        //export var rendering = Rendering;
        //export var util = Util;
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
