///<reference path="../../../lib/lodash/lodash.d.ts" />

import gl = require("./glContext");
import _ = require("lodash");
import math = require("../math/index");
import camera = require("./camera");
import texture = require("./texture");
import verify = require("../util/debug/verifier");

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
        this._modelMat = math.mat4.create();
        this._mvp = math.mat4.create();
    }

    private _modelMat;
    private _mvp;
    private _vertexes: number;
    private _shaderProgram;
    private _camera: camera;
    private _texture: texture;
    private _attribs: attribData[] = [];

    public modelMatrix(m?) {
        if(!!m) {
            math.mat4.copy(this._modelMat, m);
        }
        return math.mat4.clone(this._modelMat);
    }

    public camera(c?:camera):camera {
        if(!!c) {
            this._camera = c;
        }
        return this._camera;
    }

    public texture(t?:texture):texture {
        if(!!t) {
            this._texture = t;
        }
        return this._texture;
    }

    public render(time:number, args?:any):void {
        gl.useProgram(this._shaderProgram);
        //Set mvp matrix.
        this.setMatrix4("mvp", math.mat4.mul(this._mvp, this._camera.projectionView(), this._modelMat));

        //If we have a texture activate it
        if(!!this._texture && this._texture.loaded()) {
            this._texture.activate();
        }

        //Reactivate the shader attributes.
        _.forEach(this._attribs, (attrib) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buf);
            gl.vertexAttribPointer(attrib.attrib, attrib.size, gl.FLOAT, false, 0, 0);
        });

        //Draw!
        gl.drawElements(gl.TRIANGLES, this._vertexes, gl.UNSIGNED_SHORT, 0);
    }

    public dispose(): void {
        _.forEach(this._attribs, (buffer:number) => {
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
        verify.that(size, "size").isDefined().isGreaterThan(0);
        verify.that(data, "data").isDefined().isNotEmpty();

        var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
        gl.enableVertexAttribArray(attrib);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        this._attribs.push(new attribData(attrib, size, buf));
    }

    public setMatrix4(uniName: string, value: number[]) {
        verify.that(value, "value").isDefined().isNotEmpty();

        gl.useProgram(this._shaderProgram);
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniformMatrix4fv(uniform, false, value);
    }

    public setVector3(uniName: string, value: number[]) {
        verify.that(value, "value").isDefined().isNotEmpty();

        gl.useProgram(this._shaderProgram);
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniform3f(uniform, value[0], value[1], value[2]);
    }
}
export = renderObject;
