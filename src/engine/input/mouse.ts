///ts:import=canvas
import canvas = require('../canvas'); ///ts:import:generated

/**
 * Keeps track of the current state of the mouse.
 */
module mouse {
    /**
     * The current x position of the mouse on the screen relative to the canvas.
     * @type {number}
     */
    export var posX: number = 0;

    /**
     * The current y position of the mouse on the screen relative to the canvas.
     * @type {number}
     */
    export var posY: number = 0;

    /**
     * The current state of the buttons on the mouse.
     * True indicates the button is pressed.
     * @type {{}}
     * @private
     */
    var _state: {
        [button:number]:boolean
    } = {};

    /**
     * Gets the current states of a button on the mouse.
     * @param b The button to check. The value should be a value from mouseButtons.
     * @returns {boolean} True if the button is currently pressed. False otherwise.
     */
    export function getButton(b:number):boolean {
        return this._state[b];
    }

    /**
     * Handles the mouse down event.
     * @param e
     * @private
     */
    function _mouseDown(e) {
        _state[e.button] = true;
    }

    /**
     * Handles the mouse up event.
     * @param e
     * @private
     */
    function _mouseUp(e) {
        _state[e.button] = false;
    }

    /**
     * Handles the mouse leave event. Clears the state of the mouse.
     * @param e
     * @private
     */
    function _mouseLeave(e) {
        this.posX = 0;
        this.posY = 0;
        for(var button in _state) {
            _state[button] = false;
        }
    }

    /**
     * Handles the mouse enter event.
     * @param e
     * @private
     */
    function _mouseEnter(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
        for(var button in e.buttons) {
            _state[button] = true;
        }
    }

    /**
     * Handles the mouse move event.
     * @param e
     * @private
     */
    function _mouseMove(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
    }

    //Setup event listeners.
    canvas.addEventListener("mousedown", _mouseDown, false);
    canvas.addEventListener("mouseup", _mouseUp, false);
    canvas.addEventListener("mouseout", _mouseLeave, false);
    canvas.addEventListener("mouseenter", _mouseEnter, false);
    canvas.addEventListener("mousemove", _mouseMove, false);
}
