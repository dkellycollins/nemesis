define(["require", "exports", "../math/vec3", "../math/mat4"], function(require, exports, vec3, mat4) {
    var camera = (function () {
        function camera(pos, target) {
            this._pos = pos || vec3.create();
            this._target = target || vec3.create();
            this._proj = mat4.create();
        }
        camera.prototype.getProjection = function () {
            return mat4.copy(mat4.create(), this._proj);
        };

        camera.prototype.getView = function () {
            return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
        };

        camera.prototype.setPerspective = function (fovy, aspect, near, far) {
            mat4.perspective(this._proj, fovy, aspect, near, far);
        };

        camera.prototype.reset = function () {
            vec3.set(this._pos, 0, 0, 0);
            vec3.set(this._target, 0, 0, 0);
            mat4.identity(this._proj);
        };
        return camera;
    })();
    
    return camera;
});
