import vec3 = require("../util/math/vec3");
import mat4 = require("../util/math/mat4");

class camera {
    constructor(pos?, target?) {
        this._pos = pos || vec3.create();
        this._target = target || vec3.create();
        this._proj = mat4.create();
    }

    private _pos;
    private _target;
    private _proj;

    public getProjection() {
        return mat4.copy(mat4.create(), this._proj);
    }

    public getView() {
        return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
    }

    public setPerspective(fovy:number, aspect:number, near:number, far:number):void {
        mat4.perspective(this._proj, fovy, aspect, near, far);
    }

    public reset():void {
        vec3.set(this._pos, 0, 0, 0);
        vec3.set(this._target, 0, 0, 0);
        mat4.identity(this._proj);
    }
}
export = camera