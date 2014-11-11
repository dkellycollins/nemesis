define(["require", "exports"], function(require, exports) {
    /*import Rendering = require("./rendering/rendering");
    import Util = require("./util/util");*/
    var _nemesis;

    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        //export var rendering = Rendering;
        //export var util = Util;
        var _updateCallbacks = [];
        var _renderCallbacks = [];

        function registerUpdateCallback(update) {
            return _updateCallbacks.push(update);
        }
        nemesis.registerUpdateCallback = registerUpdateCallback;

        function deregisterUpdateCallback(updateIndex) {
            _updateCallbacks.splice(updateIndex, 1);
        }
        nemesis.deregisterUpdateCallback = deregisterUpdateCallback;

        function registerRenderCallback(render) {
            return _renderCallbacks.push(render);
        }
        nemesis.registerRenderCallback = registerRenderCallback;

        function deregisterRenderCallback(renderIndex) {
            _renderCallbacks.splice(renderIndex, 1);
        }
        nemesis.deregisterRenderCallback = deregisterRenderCallback;

        function run(context) {
            var animateFrame = function (time) {
                _updateCallbacks.forEach(function (callback) {
                    callback(time, context);
                });
                _renderCallbacks.forEach(function (callback) {
                    callback(time, context);
                });
                window.requestAnimationFrame(animateFrame);
            };
            window.requestAnimationFrame(animateFrame);
        }
        nemesis.run = run;
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});
