///<reference path="nemesis.ts" />
///<reference path="../lib/node/node.d.ts" />
var nemesis;
(function (nemesis) {
    var input;
    (function (input) {
        /***** Keyboard *****/
        /**
         * Keeps track of the current state of the keyboard.
         */
        var keyboard;
        (function (keyboard) {
            /**
             * The state of all keys on the keyboard.
             * True indicates that the key is pressed.
             * @type {{}}
             * @private
             */
            var _state = {};
            /**
             * Gets the current state of a key.
             * @param keyName The name of the key as defined by
             * @returns {boolean}
             */
            function getKey(keyName) {
                return !!_state[keyName];
            }
            keyboard.getKey = getKey;
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
            nemesis.canvas().then(function (canvas) {
                canvas.addEventListener("keyup", keyUp, false);
                canvas.addEventListener("keydown", keyDown, false);
            });
        })(keyboard = input.keyboard || (input.keyboard = {}));
        /***** Mouse Buttons *****/
        /**
         * Enum for all the possible mouse buttons.
         */
        (function (mouseButtons) {
            /**
             * The left mouse button.
             * @type {number}
             */
            mouseButtons[mouseButtons["LEFT"] = 0] = "LEFT";
            /**
             * The middle button or scroll wheel.
             * @type {number}
             */
            mouseButtons[mouseButtons["MIDDLE"] = 1] = "MIDDLE";
            /**
             * The right button.
             * @type {number}
             */
            mouseButtons[mouseButtons["RIGHT"] = 2] = "RIGHT";
        })(input.mouseButtons || (input.mouseButtons = {}));
        var mouseButtons = input.mouseButtons;
        /***** Mouse *****/
        /**
         * Keeps track of the current state of the mouse.
         */
        var mouse;
        (function (mouse) {
            /**
             * The current x position of the mouse on the screen relative to the canvas.
             * @type {number}
             */
            mouse.posX = 0;
            /**
             * The current y position of the mouse on the screen relative to the canvas.
             * @type {number}
             */
            mouse.posY = 0;
            /**
             * The current state of the buttons on the mouse.
             * True indicates the button is pressed.
             * @type {{}}
             * @private
             */
            var _state = {};
            /**
             * Gets the current states of a button on the mouse.
             * @param b The button to check. The value should be a value from mouseButtons.
             * @returns {boolean} True if the button is currently pressed. False otherwise.
             */
            function getButton(b) {
                return _state[b];
            }
            mouse.getButton = getButton;
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
                mouse.posX = 0;
                mouse.posY = 0;
                for (var button in _state) {
                    if (_state.hasOwnProperty(button)) {
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
                mouse.posX = e.clientX;
                mouse.posY = e.clientY;
                for (var button in e.buttons) {
                    if (e.buttons.hasOwnProperty(button)) {
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
                mouse.posX = e.clientX;
                mouse.posY = e.clientY;
            }
            //Setup event listeners.
            nemesis.canvas().then(function (canvas) {
                canvas.addEventListener("mouseup", _mouseUp, false);
                canvas.addEventListener("mouseout", _mouseLeave, false);
                canvas.addEventListener("mouseenter", _mouseEnter, false);
                canvas.addEventListener("mousemove", _mouseMove, false);
            });
        })(mouse || (mouse = {}));
    })(input = nemesis.input || (nemesis.input = {}));
})(nemesis || (nemesis = {}));
