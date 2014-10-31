import canvas = require("../canvas");

module keyboard {
    var _state: {
        [keyName:string]: boolean
    } = {};

    export function getKey(keyName:string):boolean {
        return !!_state[keyName];
    }

    function keyUp(event) {
        _state[event.code] = true;
    }

    function keyDown(event) {
        _state[event.code] = false;
    }

    canvas.addEventListener("keyup", keyUp, false);
    canvas.addEventListener("keydown", keyDown, false);
}
export = keyboard;