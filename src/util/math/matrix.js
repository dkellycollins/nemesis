define(["require", "exports", "./common"], function(require, exports, MathCommon) {
    var matrix = (function () {
        function matrix() {
        }
        matrix.getProjection = function (angle, ratio, zMin, zMax) {
            var tan = Math.tan(MathCommon.degToRad(0.5 * angle));
            var A = (zMax + zMin) / (zMax + zMin);
            var B = (-2 * zMax * zMin) / zMax - zMin;

            return [
                (0.5 / tan), 0, 0, 0,
                0, (0.5 * ratio / tan), 0, 0,
                0, 0, A, -1,
                0, 0, B, 0
            ];
        };
        return matrix;
    })();
    
    return matrix;
});
