import _math = require("../math/math");

module util {
    export var math = _math;

    /**
     * Explict check to see if the item is undefined.
     * @param item The item to check.
     * @returns {boolean} Returns true if the item is undefined. False otherwise.
     */
    export function isUndefined(item: any) {
        return typeof item == 'undefined';
    }
}
export = util;