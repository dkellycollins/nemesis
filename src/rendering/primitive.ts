import Logger = require("../util/logging/consoleLogger");

class primitive {
    constructor(gl) {
        this._gl = gl;
    }

    private _gl: WebGLRenderingContext;

    public drawTriangles(numOfPoints: number):void {
        this._gl.viewport(0.0, 0.0, this._gl.canvas.width, this._gl.canvas.height);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        this._gl.drawElements(this._gl.TRIANGLES, numOfPoints, this._gl.UNSIGNED_SHORT, 0);
        this._gl.flush();
    }

    public createArrayBuffer(bufferData: number[]): WebGLBuffer {
        return this.createBuffer(new Float32Array(bufferData), this._gl.ARRAY_BUFFER);
    }

    public createElementArrayBuffer(bufferData: number[]): WebGLBuffer {
        return this.createBuffer(new Uint16Array(bufferData), this._gl.ELEMENT_ARRAY_BUFFER);
    }

    private createBuffer(bufferData, bufferType): WebGLBuffer {
        var buffer = this._gl.createBuffer();
        this._gl.bindBuffer(bufferType, buffer);
        this._gl.bufferData(bufferType,
            bufferData,
            this._gl.STATIC_DRAW);

        return buffer;
    }

    public deleteBuffer(buffer: number) {
        this._gl.deleteBuffer(buffer);
    }
}

export = primitive;