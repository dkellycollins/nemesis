define(["require", "exports", "../canvas"], function(require, exports, canvas) {
    var mouse = (function () {
        function mouse() {
            canvas.addEventListener("mousedown", this._mouseDown, false);
            canvas.addEventListener("mouseup", this._mouseUp, false);
            canvas.addEventListener("mouseout", this._mouseLeave, false);
            canvas.addEventListener("mouseenter", this._mouseEnter, false);
            canvas.addEventListener("mousemove", this._mouseMove, false);
        }
        mouse.prototype.getButton = function (b) {
            return this._button == b;
        };

        mouse.prototype._mouseDown = function (e) {
            this._button = e.button;
        };

        mouse.prototype._mouseUp = function (e) {
            this._button = -1;
        };

        mouse.prototype._mouseLeave = function (e) {
            this.posX = 0;
            this.posY = 0;
        };

        mouse.prototype._mouseEnter = function (e) {
            this.posX = e.clientX;
            this.posY = e.clientY;
        };

        mouse.prototype._mouseMove = function (e) {
            this.posX = e.clientX;
            this.posY = e.clientY;
        };
        return mouse;
    })();
});
