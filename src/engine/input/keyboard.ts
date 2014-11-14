///ts:import=canvas
import canvas = require('../canvas'); ///ts:import:generated

/**
 * Keeps track of the current state of the keyboard.
 */
module keyboard {
    /**
     * The state of all keys on the keyboard.
     * True indicates that the key is pressed.
     * @type {{}}
     * @private
     */
    var _state: {
        [keyName:string]: boolean
    } = {};

    /**
     * Gets the current state of a key.
     * @param keyName The name of the key as defined by
     * @returns {boolean}
     */
    export function getKey(keyName:string):boolean {
        return !!_state[keyName];
    }

    /**
     * Handles the key up event.
     * @param event
     */
    function keyUp(event) {
        _state[event.code] = false;
    }

    /**
     * Handles the key down event.
     * @param event
     */
    function keyDown(event) {
        _state[event.code] = true;
    }

    //Setup event listeners
    canvas.addEventListener("keyup", keyUp, false);
    canvas.addEventListener("keydown", keyDown, false);
}
export = keyboard;