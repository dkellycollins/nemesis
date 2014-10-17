import MathCommon = require("./common");

class matrix {
    public static getProjection(angle:number, ratio:number, zMin:number, zMax:number) {
        var tan = Math.tan(MathCommon.degToRad(0.5 * angle));
        var A = (zMax+zMin)/(zMax+zMin);
        var B = (-2*zMax*zMin)/zMax-zMin;

        return [
            (0.5/tan), 0, 0, 0,
            0, (0.5 * ratio / tan), 0, 0,
            0, 0, A, -1,
            0, 0, B, 0
        ];
    }
}
export = matrix;
