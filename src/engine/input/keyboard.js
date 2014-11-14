define(["require", "exports", '../canvas'], function (require, exports, canvas) {
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
        canvas.addEventListener("keyup", keyUp, false);
        canvas.addEventListener("keydown", keyDown, false);
    })(keyboard || (keyboard = {}));
    return keyboard;
});
