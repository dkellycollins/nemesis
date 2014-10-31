import canvas = require("../canvas");

module mouse {
    export var posX: number = 0;
    export var posY: number = 0;

    var _state: {
        [button:number]:boolean
    } = {};

    export function getButton(b:number):boolean {
        return this._button == b;
    }

    function _mouseDown(e) {
        _state[e.button] = true;
    }

    function _mouseUp(e) {
        _state[e.button] = false;
    }

    function _mouseLeave(e) {
        this.posX = 0;
        this.posY = 0;
    }

    function _mouseEnter(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
    }

    function _mouseMove(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
    }

    canvas.addEventListener("mousedown", _mouseDown, false);
    canvas.addEventListener("mouseup", _mouseUp, false);
    canvas.addEventListener("mouseout", _mouseLeave, false);
    canvas.addEventListener("mouseenter", _mouseEnter, false);
    canvas.addEventListener("mousemove", _mouseMove, false);
}
