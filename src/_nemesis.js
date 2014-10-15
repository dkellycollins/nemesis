///<reference path="./nemesisConfig.d.ts" />
define(["require", "exports", "json!config.json"], function(require, exports, config) {
    /* The nemesis class defines methods and varible that are used by those methods. */
    var _nemesis = (function () {
        function _nemesis() {
        }
        _nemesis.config = function (c) {
            if (!!c) {
                this._config = c;
            }
            return this._config || config;
        };

        _nemesis.canvas = function () {
            if (!this._canvas) {
                if (this.config().canvasId) {
                    this._canvas = document.getElementById(this.config().canvasId);
                } else {
                    this._canvas = document.getElementsByTagName('canvas')[0];
                }
            }
            return this._canvas;
        };

        _nemesis.animate = function (animateFunc, args) {
            var _this = this;
            this._animate = function (args) {
                animateFunc(args);
                window.requestAnimationFrame(function () {
                    _this._animate(args);
                });
            }; //TODO will this cause a memory leak?
            this._animate(args);
        };
        return _nemesis;
    })();
    
    return _nemesis;
});
//# sourceMappingURL=_nemesis.js.map