import shaderProgram = require("./shaderProgram");

class renderObject {
    constructor(gl:WebGLRenderingContext, vertexes: number[], faces: number[], triangles: number) {
        this._gl = gl;
        this._triangles = triangles;

        this._vertexBuffer = this._createArrayBuffer(vertexes);
        this._faceBuffer = this._createElementArrayBuffer(faces);
    }

    private _gl: WebGLRenderingContext;
    private _triangles: number;
    private _vertexBuffer: WebGLBuffer;
    private _faceBuffer: WebGLBuffer;
    private _shaderProgram: shaderProgram;

    public setShader(shader: shaderProgram) {
        this._shaderProgram = shader;
    }

    public getShader():shaderProgram {
        return this._shaderProgram;
    }

    public render():void {
        this._gl.useProgram(this._shaderProgram.Id);
        this._gl.drawElements(this._gl.TRIANGLES, this._triangles, this._gl.UNSIGNED_SHORT, 0);
    }

    public clone(): renderObject {
        return null;
    }

    public dispose(): void {
        this._gl.deleteBuffer(this._vertexBuffer);
        this._gl.deleteBuffer(this._faceBuffer);
    }

    private _createArrayBuffer(bufferData: number[]): WebGLBuffer {
        return this._createBuffer(new Float32Array(bufferData), this._gl.ARRAY_BUFFER);
    }

    private _createElementArrayBuffer(bufferData: number[]): WebGLBuffer {
        return this._createBuffer(new Uint16Array(bufferData), this._gl.ELEMENT_ARRAY_BUFFER);
    }

    private _createBuffer(bufferData, bufferType): WebGLBuffer {
        var buffer = this._gl.createBuffer();
        this._gl.bindBuffer(bufferType, buffer);
        this._gl.bufferData(bufferType,
            bufferData,
            this._gl.STATIC_DRAW);

        return buffer;
    }
}
export = renderObject;
