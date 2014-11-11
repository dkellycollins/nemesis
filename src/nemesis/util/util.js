define(["require", "exports", "../math/math"], function(require, exports, _math) {
    var util;
    (function (util) {
        util.math = _math;

        /**
        * Explict check to see if the item is undefined.
        * @param item The item to check.
        * @returns {boolean} Returns true if the item is undefined. False otherwise.
        */
        function isUndefined(item) {
            return typeof item == 'undefined';
        }
        util.isUndefined = isUndefined;
    })(util || (util = {}));
    
    return util;
});
