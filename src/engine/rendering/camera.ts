import canvas = require("../canvas");
import vec3 = require("../math/vec3");
import mat4 = require("../math/mat4");

class camera {
    constructor(pos?, target?) {
        this._pos = pos || vec3.create();
        this._target = target || vec3.create();
        this._fov = 40;
        this._aspect = canvas.width / canvas.height;
        this._nearClip = 1;
        this._farClip = 100;
        this._proj = mat4.perspective(mat4.create(), this._fov, this._aspect, this._nearClip, this._farClip);
    }

    private _fov: number;
    private _nearClip: number;
    private _farClip: number;
    private _aspect: number;
    private _pos;
    private _target;
    private _proj;

    public fov(fov?:number):number {
        if(!!fov) {
            this._fov = fov;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._fov;
    }

    public nearClip(nearClip?:number):number {
        if(!!nearClip) {
            this._nearClip = nearClip;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._nearClip;
    }

    public farClip(farClip?:number): number {
        if(!!farClip) {
            this._farClip = farClip;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._farClip;
    }

    public aspectRatio(aspectRatio?: number):number {
        if(!!aspectRatio) {
            this._aspect = aspectRatio;
            mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
        }
        return this._aspect;
    }

    public projectionView() {
        var ret = mat4.create();
        mat4.lookAt(ret, this._pos, this._target, vec3.UNIT_Y);
        return mat4.mul(ret, this._proj, ret);
    }

    public getProjection() {
        return mat4.copy(mat4.create(), this._proj);
    }

    public getView() {
        return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
    }
}
export = camera