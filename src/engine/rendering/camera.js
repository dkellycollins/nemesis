define(["require", "exports", "../canvas", "../math/vec3", "../math/mat4"], function (require, exports, canvas, vec3, mat4) {
    /**
     *
     */
    var camera = (function () {
        /**
         * Creates a new camera at the given position, looking at the given target.
         * @param pos {vec3} The position to create the camera at
         * @param target {vec3} The position for the camera to look at
         */
        function camera(pos, target) {
            this._pos = pos || vec3.create();
            this._target = target || vec3.create();
            this._fov = 45;
            this._aspect = canvas.width / canvas.height;
            this._nearClip = 1;
            this._farClip = 100;
            this._proj = mat4.perspective(mat4.create(), this._fov, this._aspect, this._nearClip, this._farClip);
        }
        /**
         * Gets or sets the field of view
         * @param fov The new field of view
         * @returns {number} The current field of view
         */
        camera.prototype.fov = function (fov) {
            if (!!fov) {
                this._fov = fov;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._fov;
        };
        /**
         * Gets or sets the near clip plane
         * @param nearClip The new near clip plane
         * @returns {number} The current near clip plane
         */
        camera.prototype.nearClip = function (nearClip) {
            if (!!nearClip) {
                this._nearClip = nearClip;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._nearClip;
        };
        /**
         * Gets or sets the far clip plane
         * @param farClip The new far clip plane
         * @returns {number} The current far clip plane
         */
        camera.prototype.farClip = function (farClip) {
            if (!!farClip) {
                this._farClip = farClip;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._farClip;
        };
        /**
         * Gets or sets the aspect ratio
         * @param aspectRatio The new aspect ratio
         * @returns {number} The current aspect ratio
         */
        camera.prototype.aspectRatio = function (aspectRatio) {
            if (!!aspectRatio) {
                this._aspect = aspectRatio;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._aspect;
        };
        /**
         * Gets the current projection view matrix. This is a slight optimiation of getView() * getProjection()
         * @returns {mat4}
         */
        camera.prototype.projectionView = function () {
            var ret = mat4.create();
            mat4.lookAt(ret, this._pos, this._target, vec3.UNIT_Y);
            return mat4.mul(ret, this._proj, ret);
        };
        /**
         * Gets the current projection matrix
         * @returns {mat4}
         */
        camera.prototype.getProjection = function () {
            return mat4.copy(mat4.create(), this._proj);
        };
        /**
         * Gets the current view matrix
         * @returns {mat4}
         */
        camera.prototype.getView = function () {
            return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
        };
        return camera;
    })();
    return camera;
});
