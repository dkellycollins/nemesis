///<reference path="../../../lib/lodash/lodash.d.ts" />

import gl = require("./glContext");
import _ = require("lodash");

class attribData {
    constructor(
        public attrib,
        public size,
        public buf
    ) {}
}

class renderObject {

    constructor(shaderProgram) {
        this._shaderProgram = shaderProgram;
    }

    private _vertexes: number;
    private _shaderProgram;
    private _buffer: attribData[] = [];
    //private _buffer: WebGLBuffer[] = [];

    public render(time:number, args?:any):void {
        gl.useProgram(this._shaderProgram);
        _.forEach(this._buffer, (buffer) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buf);
            gl.vertexAttribPointer(buffer.attrib, buffer.size, gl.FLOAT, false, 0, 0);
        });
        gl.drawElements(gl.TRIANGLES, this._vertexes, gl.UNSIGNED_SHORT, 0);
    }

    public dispose(): void {
        _.forEach(this._buffer, (buffer:number) => {
            gl.deleteBuffer(buffer);
        });
    }

    public setVertexes(vertexes:number[]): void {
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexes), gl.STATIC_DRAW);
        this._vertexes = vertexes.length;
    }

    public enableAttrib(attribName: string, size: number, data:number[]) {
        var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
        gl.enableVertexAttribArray(attrib);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        this._buffer.push(new attribData(attrib, size, buf));
    }

    public setMatrix4(uniName: string, value: number[]) {
        gl.useProgram(this._shaderProgram);
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniformMatrix4fv(uniform, false, value);
    }

    public setVector3(uniName: string, value: number[]) {
        gl.useProgram(this._shaderProgram);
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniform3f(uniform, value[0], value[1], value[2]);
    }
}
export = renderObject;
