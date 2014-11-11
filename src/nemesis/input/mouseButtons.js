define(["require", "exports"], function(require, exports) {
    /**
    * Enum for all the possible mouse buttons.
    */
    var mouseButtons;
    (function (mouseButtons) {
        /**
        * The left mouse button.
        * @type {number}
        */
        mouseButtons.Left = 0;

        /**
        * The middle button or scroll wheel.
        * @type {number}
        */
        mouseButtons.Middle = 1;

        /**
        * The right button.
        * @type {number}
        */
        mouseButtons.Right = 2;
    })(mouseButtons || (mouseButtons = {}));
    
    return mouseButtons;
});
