///<reference path="nemesis.ts" />
///<reference path="../lib/node/node.d.ts" />

module nemesis.input {
    /***** Keyboard *****/
    /**
     * Keeps track of the current state of the keyboard.
     */
    export module keyboard {
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
        nemesis.canvas().then((canvas) => {
            canvas.addEventListener("keyup", keyUp, false);
            canvas.addEventListener("keydown", keyDown, false);
        });
    }

    /***** Mouse Buttons *****/
    /**
     * Enum for all the possible mouse buttons.
     */
    export enum mouseButtons {
        /**
         * The left mouse button.
         * @type {number}
         */
        LEFT = 0,

        /**
         * The middle button or scroll wheel.
         * @type {number}
         */
        MIDDLE = 1,

        /**
         * The right button.
         * @type {number}
         */
        RIGHT = 2
    }

    /***** Mouse *****/

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
            return _state[b];
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
            posX = 0;
            posY = 0;
            for(var button in _state) {
                if(_state.hasOwnProperty(button)) {
                    continue;
                }

                _state[button] = false;
            }
        }

        /**
         * Handles the mouse enter event.
         * @param e
         * @private
         */
        function _mouseEnter(e) {
            posX = e.clientX;
            posY = e.clientY;
            for(var button in e.buttons) {
                if(e.buttons.hasOwnProperty(button)) {
                    continue;
                }

                _state[button] = true;
            }
        }

        /**
         * Handles the mouse move event.
         * @param e
         * @private
         */
        function _mouseMove(e) {
            posX = e.clientX;
            posY = e.clientY;
        }

        //Setup event listeners.
        nemesis.canvas().then((canvas) => {
            canvas.addEventListener("mouseup", _mouseUp, false);
            canvas.addEventListener("mouseout", _mouseLeave, false);
            canvas.addEventListener("mouseenter", _mouseEnter, false);
            canvas.addEventListener("mousemove", _mouseMove, false);
        });
    }
}