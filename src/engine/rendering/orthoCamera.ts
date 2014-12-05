import canvas = require("../canvas");
import vec3 = require("../math/vec3");
import mat4 = require("../math/mat4");

class orthoCamera {
    constructor(pos?, target?) {
        this._pos = pos || vec3.create();
        this._target = target || vec3.create();
        this._nearClip = 1;
        this._farClip = 100;
        this._left = 0;
        this._bottom = 0;
        this._right = canvas.width;
        this._top = canvas.height;
        this._proj = mat4.ortho(mat4.create(), this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
    }

    private _nearClip: number;
    private _farClip: number;
    private _left: number;
    private _right: number;
    private _top: number;
    private _bottom: number;
    private _pos;
    private _target;
    private _proj;

    public nearClip(nearClip?:number):number {
        if(!!nearClip) {
            this._nearClip = nearClip;
            mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        return this._nearClip;
    }

    public farClip(farClip?:number): number {
        if(!!farClip) {
            this._farClip = farClip;
            mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        return this._farClip;
    }

    public left(l?:number): number {
        if(!!l) {
            this._left = l;
            mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        return this._left;
    }

    public right(r?:number): number {
        if(!!r) {
            this._right = r;
            mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        return this._right;
    }

    public bottom(b?:number): number {
        if(!!b) {
            this._bottom = b;
            mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        return this._bottom;
    }

    public top(t?:number): number {
        if(!!t) {
            this._top = t;
            mat4.ortho(this._proj, this._left, this._right, this._bottom, this._top, this._nearClip, this._farClip);
        }
        return this._top;
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

export = orthoCamera