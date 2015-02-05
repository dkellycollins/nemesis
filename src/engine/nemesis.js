var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./eventObject", './input/index', './math/index', './rendering/index', "./canvas", "./config"], function (require, exports, eventObject, _input, _math, _rendering, _canvas, _config) {
    /**
     * The entry point class. Contains reference to other modules and manages the game loop.
     */
    var nemesis = (function (_super) {
        __extends(nemesis, _super);
        /**
         * Default constructor.
         */
        function nemesis(input, math, rendering, canvas, config) {
            _super.call(this);
            this.input = input;
            this.math = math;
            this.rendering = rendering;
            this.canvas = canvas;
            this.config = config;
            this.registerEvent("update");
            this.registerEvent("render");
        }
        /**
         * Starts the game.
         * @param context An object that gets passed to each function, each time a frame is rendered.
         */
        nemesis.prototype.run = function (context) {
            var _this = this;
            _rendering.render.init();
            var animateFrame = function (time) {
                _this.emit("update", time, context);
                _rendering.render.begin();
                _this.emit("render", time, context);
                _rendering.render.end();
                window.requestAnimationFrame(animateFrame);
            };
            window.requestAnimationFrame(animateFrame);
        };
        return nemesis;
    })(eventObject);
    var _nemesis = new nemesis(_input, _math, _rendering, _canvas, _config);
    return _nemesis;
});
