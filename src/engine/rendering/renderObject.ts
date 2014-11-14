import gl = require("./glContext");
import _ = require("lodash");

class attribData {
    constructor(id, index, type, normalize, stride, offset) {
        this.id = id;
        this.index = index;
        this.type = type;
        this.normalize = normalize;
        this.stride = stride;
        this.offset = offset;
    }

    public id;
    public index:number;
    public type;
    public normalize:boolean;
    public stride:number;
    public offset:number;
}

class renderObject {

    constructor(data: number[], faces:number[], triangles: number, shaderProgram) {
        this._vertexData = new Float32Array(data);
        this._faces = new Uint16Array(faces);
        this._triangles = triangles;
        this._shaderProgram = shaderProgram;
    }

    private _triangles: number;
    private _vertexDataBuffer: WebGLBuffer;
    private _vertexData: Float32Array;
    private _faceBuffer: WebGLBuffer;
    private _faces: Uint16Array;
    private _shaderProgram;
    private _attribData: {
        [attrib:string]: attribData;
    } = {};

    public init(): void {
        this._vertexDataBuffer = gl.createBuffer();
        this._faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._vertexData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._faceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._faces, gl.STATIC_DRAW);
    }

    public setActive():void {
        gl.useProgram(this._shaderProgram);
    }

    public render(time:number, args?:any):void {
        //gl.useProgram(this._shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexDataBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._faceBuffer);
        _.forEach(this._attribData, (attrib: attribData) => {
           gl.vertexAttribPointer(attrib.id, attrib.index, attrib.type, attrib.normalize, attrib.stride, attrib.offset);
        });
        gl.drawElements(gl.TRIANGLES, this._triangles, gl.UNSIGNED_SHORT, 0);
    }

    public dispose(): void {
        gl.deleteBuffer(this._vertexDataBuffer);
        gl.deleteBuffer(this._faceBuffer);
    }

    public enableAttrib(attribName: string, index: number, stride:number, offset: number) {
        var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
        gl.enableVertexAttribArray(attrib);
        this._attribData[attribName] = new attribData(attrib, index, gl.FLOAT, false, stride, offset);
        gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, offset);
    }

    public setMatrix(uniName: string, value: number[]) {
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniformMatrix4fv(uniform, false, value);
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
