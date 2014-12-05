define(["require", "exports"], function (require, exports) {
    /**
     * Enum for all the possible mouse buttons.
     */
    var mouseButtons;
    (function (mouseButtons) {
        /**
         * The left mouse button.
         * @type {number}
         */
        mouseButtons.LEFT = 0;
        /**
         * The middle button or scroll wheel.
         * @type {number}
         */
        mouseButtons.MIDDLE = 1;
        /**
         * The right button.
         * @type {number}
         */
        mouseButtons.RIGHT = 2;
    })(mouseButtons || (mouseButtons = {}));
    return mouseButtons;
});
