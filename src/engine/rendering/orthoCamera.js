define(["require", "exports", "../canvas", "../math/vec3", "../math/mat4"], function (require, exports, canvas, vec3, mat4) {
    var orthoCamera = (function () {
        function orthoCamera(pos, target) {
            this._pos = pos || vec3.create();
            this._target = target || vec3.create();
            var ratio = canvas.width / canvas.height;
            this._nearClip = 1;
            this._farClip = 1000;
            this._left = -ratio;
            this._bottom = -1;
            this._right = ratio;
            this._top = 1;
            this._proj = mat4.ortho(mat4.create(), this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        orthoCamera.prototype.nearClip = function (nearClip) {
            if (!!nearClip) {
                this._nearClip = nearClip;
                mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
            }
            return this._nearClip;
        };
        orthoCamera.prototype.farClip = function (farClip) {
            if (!!farClip) {
                this._farClip = farClip;
                mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
            }
            return this._farClip;
        };
        orthoCamera.prototype.left = function (l) {
            if (!!l) {
                this._left = l;
                mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
            }
            return this._left;
        };
        orthoCamera.prototype.right = function (r) {
            if (!!r) {
                this._right = r;
                mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
            }
            return this._right;
        };
        orthoCamera.prototype.bottom = function (b) {
            if (!!b) {
                this._bottom = b;
                mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
            }
            return this._bottom;
        };
        orthoCamera.prototype.top = function (t) {
            if (!!t) {
                this._top = t;
                mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
            }
            return this._top;
        };
        orthoCamera.prototype.projectionView = function () {
            var ret = mat4.create();
            mat4.lookAt(ret, this._pos, this._target, vec3.UNIT_Y);
            return mat4.mul(ret, this._proj, ret);
        };
        orthoCamera.prototype.getProjection = function () {
            return mat4.copy(mat4.create(), this._proj);
        };
        orthoCamera.prototype.getView = function () {
            return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
        };
        return orthoCamera;
    })();
    return orthoCamera;
});
