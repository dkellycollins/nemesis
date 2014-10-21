define(["require", "exports", "./math/math"], function(require, exports, _math) {
    var util;
    (function (util) {
        util.math = _math;
    })(util || (util = {}));
    
    return util;
});
