/// <reference path="nemesis.d.ts" />
/// <reference path="../lib/node/node.d.ts" />
declare module nemesis.input {
    /***** Keyboard *****/
    /**
     * Keeps track of the current state of the keyboard.
     */
    module keyboard {
        /**
         * Gets the current state of a key.
         * @param keyName The name of the key as defined by
         * @returns {boolean}
         */
        function getKey(keyName: string): boolean;
    }
    /***** Mouse Buttons *****/
    /**
     * Enum for all the possible mouse buttons.
     */
    enum mouseButtons {
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
        RIGHT = 2,
    }
}
