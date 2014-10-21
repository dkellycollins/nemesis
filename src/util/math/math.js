define(["require", "exports", "./mat2", "./mat2d", "./mat3", "./mat4", "./quat", "./vec2", "./vec3", "./vec4"], function(require, exports, _mat2, _mat2d, _mat3, _mat4, _quat, _vec2, _vec3, _vec4) {
    var math;
    (function (math) {
        math.mat2 = _mat2;
        math.mat2d = _mat2d;
        math.mat3 = _mat3;
        math.mat4 = _mat4;
        math.quat = _quat;
        math.vec2 = _vec2;
        math.vec3 = _vec3;
        math.vec4 = _vec4;
    })(math || (math = {}));
    
    return math;
});
