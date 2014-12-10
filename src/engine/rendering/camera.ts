import canvas = require("../canvas");
import vec3 = require("../math/vec3");
import mat4 = require("../math/mat4");

/**
 *
 */
class camera {
    /**
     * Creates a new camera at the given position, looking at the given target.
     * @param pos {vec3} The position to create the camera at
     * @param target {vec3} The position for the camera to look at
     */
    constructor(pos?, target?) {
        this._pos = pos || vec3.create();
        this._target = target || vec3.create();
        this._fov = 45;
        this._aspect = canvas.width / canvas.height;
        this._nearClip = 1;
        this._farClip = 100;
        this._proj = mat4.perspective(mat4.create(), this._fov, this._aspect, this._nearClip, this._farClip);
    }

    /**
     * Field of view
     */
    private _fov: number;

    /**
     * Near clip plane
     */
    private _nearClip: number;

    /**
     * Far clip plane
     */
    private _farClip: number;

    /**
     * Aspect ratio
     */
    private _aspect: number;

    /**
     * Camera position
     */
    private _pos;

    /**
     * Position for the camera to look at
     */
    private _target;

    /**
     * The projection matrix
     */
    private _proj;

    /**
     * Gets or sets the field of view
     * @param fov The new field of view
     * @returns {number} The current field of view
     */
    public fov(fov?:number):number {
        if(!!fov) {
            this._fov = fov;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._fov;
    }

    /**
     * Gets or sets the near clip plane
     * @param nearClip The new near clip plane
     * @returns {number} The current near clip plane
     */
    public nearClip(nearClip?:number):number {
        if(!!nearClip) {
            this._nearClip = nearClip;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._nearClip;
    }

    /**
     * Gets or sets the far clip plane
     * @param farClip The new far clip plane
     * @returns {number} The current far clip plane
     */
    public farClip(farClip?:number): number {
        if(!!farClip) {
            this._farClip = farClip;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._farClip;
    }

    /**
     * Gets or sets the aspect ratio
     * @param aspectRatio The new aspect ratio
     * @returns {number} The current aspect ratio
     */
    public aspectRatio(aspectRatio?: number):number {
        if(!!aspectRatio) {
            this._aspect = aspectRatio;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._aspect;
    }

    /**
     * Gets the current projection view matrix. This is a slight optimiation of getView() * getProjection()
     * @returns {mat4}
     */
    public projectionView() {
        var ret = mat4.create();
        mat4.lookAt(ret, this._pos, this._target, vec3.UNIT_Y);
        return mat4.mul(ret, this._proj, ret);
    }

    /**
     * Gets the current projection matrix
     * @returns {mat4}
     */
    public getProjection() {
        return mat4.copy(mat4.create(), this._proj);
    }

    /**
     * Gets the current view matrix
     * @returns {mat4}
     */
    public getView() {
        return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
    }
}
export = camera