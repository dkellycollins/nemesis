define(["require", "exports", './input/index', './math/index', './rendering/index', "./canvas", "./config"], function (require, exports, _input, _math, _rendering, _canvas, _config) {
    /* The engine module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.input = _input;
        nemesis.math = _math;
        nemesis.rendering = _rendering;
        nemesis.canvas = _canvas;
        nemesis.config = _config;
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
                _rendering.render.begin();
                _renderCallbacks.forEach(function (callback) {
                    callback(time, context);
                });
                _rendering.render.end();
                window.requestAnimationFrame(animateFrame);
            };
            window.requestAnimationFrame(animateFrame);
        }
        nemesis.run = run;
    })(nemesis || (nemesis = {}));
    return nemesis;
});
