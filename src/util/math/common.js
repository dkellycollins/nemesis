define(["require", "exports"], function(require, exports) {
    var common = (function () {
        function common() {
        }
        common.degToRad = function (angle) {
            return (angle * Math.PI / 180);
        };
        return common;
    })();
    
    return common;
});
