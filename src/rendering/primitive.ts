import Logger = require("../util/logging/consoleLogger");

class primitive {
    constructor(gl) {
        this._gl = gl;

        this._gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.depthFunc(this._gl.LEQUAL);
        this._gl.clearDepth(1.0);
    }

    private _gl: WebGLRenderingContext;

    public begin(): void {
        this._gl.viewport(0.0, 0.0, this._gl.canvas.width, this._gl.canvas.height);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }

    public end(): void {
        this._gl.flush();
    }
}

export = primitive;