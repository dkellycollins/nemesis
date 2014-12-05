define(["require", "exports", "../canvas", "../math/vec3", "../math/mat4"], function (require, exports, canvas, vec3, mat4) {
    var camera = (function () {
        function camera(pos, target) {
            this._pos = pos || vec3.create();
            this._target = target || vec3.create();
            this._fov = 40;
            this._aspect = canvas.width / canvas.height;
            this._nearClip = 1;
            this._farClip = 100;
            this._proj = mat4.perspective(mat4.create(), this._fov, this._aspect, this._nearClip, this._farClip);
        }
        camera.prototype.fov = function (fov) {
            if (!!fov) {
                this._fov = fov;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._fov;
        };
        camera.prototype.nearClip = function (nearClip) {
            if (!!nearClip) {
                this._nearClip = nearClip;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._nearClip;
        };
        camera.prototype.farClip = function (farClip) {
            if (!!farClip) {
                this._farClip = farClip;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._farClip;
        };
        camera.prototype.aspectRatio = function (aspectRatio) {
            if (!!aspectRatio) {
                this._aspect = aspectRatio;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._aspect;
        };
        camera.prototype.projectionView = function () {
            var ret = mat4.create();
            mat4.lookAt(ret, this._pos, this._target, vec3.UNIT_Y);
            return mat4.mul(ret, this._proj, ret);
        };
        camera.prototype.getProjection = function () {
            return mat4.copy(mat4.create(), this._proj);
        };
        camera.prototype.getView = function () {
            return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
        };
        return camera;
    })();
    return camera;
});
