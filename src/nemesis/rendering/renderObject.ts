import gl = require("./glContext");
import shaderProgram = require("./shaderProgram");

class renderObject {

    constructor(vertexes: number[], faces: number[], triangles: number) {
        this._triangles = triangles;
        this._vertexBuffer = this._createArrayBuffer(vertexes);
        this._faceBuffer = this._createElementArrayBuffer(faces);
    }

    public staticDraw: boolean;
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

    public render(time:number, args?:any):void {
        gl.useProgram(this._shaderProgram.id);
        this._shaderProgram.update(time, args);
        gl.drawElements(gl.TRIANGLES, this._triangles, gl.UNSIGNED_SHORT, 0);
    }

    public clone(): renderObject {
        return null;
    }

    public dispose(): void {
        gl.deleteBuffer(this._vertexBuffer);
        gl.deleteBuffer(this._faceBuffer);
    }

    private _createArrayBuffer(bufferData: number[]): WebGLBuffer {
        return this._createBuffer(new Float32Array(bufferData), gl.ARRAY_BUFFER);
    }

    private _createElementArrayBuffer(bufferData: number[]): WebGLBuffer {
        return this._createBuffer(new Uint16Array(bufferData), gl.ELEMENT_ARRAY_BUFFER);
    }

    private _createBuffer(bufferData, bufferType): WebGLBuffer {
        var buffer = gl.createBuffer();
        gl.bindBuffer(bufferType, buffer);
        gl.bufferData(bufferType,
            bufferData,
            gl.STATIC_DRAW);

        return buffer;
    }
}
export = renderObject;
