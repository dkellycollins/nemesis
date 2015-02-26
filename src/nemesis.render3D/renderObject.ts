///<reference path="../../../lib/lodash/lodash.d.ts" />

import gl = require("./glContext");
import math = require("../math/index");
import camera = require("./camera");
import texture = require("./texture");
import verify = require("../nemesis/verifier");

/**
 * A private class that contains shader attribute data.
 */
class attribData {
    constructor(
        public attrib,
        public size,
        public buf
    ) {}
}

/**
 * Represents an object that can be drawn.
 */
class renderObject {
    /**
     * Creates a new renderObject with the given shaderProgram
     * @param shaderProgram The shader program to render this object with.
     */
    constructor(shaderProgram) {
        this._shaderProgram = shaderProgram;
        this._modelMat = math.mat4.create();
        this._mvp = math.mat4.create();
    }

    /**
     * The model matrix for this object. Contains position, rotation and scale.
     */
    private _modelMat;

    /**
     * The model-view-projection matrix that gets sent to the shader program.
     */
    private _mvp;

    /**
     * The number of vertexes this object has.
     */
    private _vertexes: number;

    /**
     * The shader program used to draw this object.
     */
    private _shaderProgram;

    /**
     * The camera that "sees" this object.
     */
    private _camera: camera;

    /**
     * The texture (if any) this object uses.
     */
    private _texture: texture;

    /**
     * Contians data on each attribute intialized.
     * @type {Array}
     * @private
     */
    private _attribs: attribData[] = [];

    /**
     * Gets or sets the model matrix for this object. Model matricies contain position, rotation, and scale.
     * @param m {mat4} The new model matrix
     * @returns {mat4} The current model matrix
     */
    public modelMatrix(m?) {
        if(!!m) {
            math.mat4.copy(this._modelMat, m);
        }
        return math.mat4.clone(this._modelMat);
    }

    /**
     * Gets or sets the camera that "sees" this object.
     * @param c {camera} The new camera.
     * @returns {camera} The current camera
     */
    public camera(c?:camera):camera {
        if(!!c) {
            this._camera = c;
        }
        return this._camera;
    }

    /**
     * Gets or sets the texture to apply to this object.
     * @param t {texture} The new texture
     * @returns {texture} The current texture
     */
    public texture(t?:texture):texture {
        if(!!t) {
            this._texture = t;
        }
        return this._texture;
    }

    /**
     * Renders this object to the canvas
     */
    public render():void {
        gl.useProgram(this._shaderProgram);
        //Set mvp matrix.
        this.setMatrix4("mvp", math.mat4.mul(this._mvp, this._camera.projectionView(), this._modelMat));

        //If we have a texture activate it
        if(!!this._texture && this._texture.loaded()) {
            this._texture.activate();
        }

        //Reactivate the shader attributes.
        this._attribs.forEach((attrib) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buf);
            gl.vertexAttribPointer(attrib.attrib, attrib.size, gl.FLOAT, false, 0, 0);
        });

        //Draw!
        gl.drawElements(gl.TRIANGLES, this._vertexes, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Deletes any used resources on the graphics card.
     */
    public dispose(): void {
        this._attribs.forEach((attrib:attribData) => {
            gl.deleteBuffer(attrib.buf);
        });
    }

    /**
     * Sets the vertexes for this object. Vertexes tell the graphics card in what order to draw the vertexes.
     * @param vertexes The vertexes to set
     */
    public setVertexes(vertexes:number[]): void {
        verify.that(vertexes, "vertexes").isDefined().isNotEmpty();

        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexes), gl.STATIC_DRAW);
        this._vertexes = vertexes.length;
    }

    /**
     * Enable an attribute in the shader with the given data.
     * @param attribName The name of the attribute
     * @param size The number of items in data that make up a single attribute
     * @param data Data for each vertex
     */
    public enableAttrib(attribName: string, size: number, data:number[]) {
        verify.that(attribName, "atttibName").isDefined();
        verify.that(size, "size").isDefined().isGreaterThan(0);
        verify.that(data, "data").isDefined().isNotEmpty();

        var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
        gl.enableVertexAttribArray(attrib);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        this._attribs.push(new attribData(attrib, size, buf));
    }

    /**
     * Sets a mat4 in the shader program.
     * @param uniName The name of the uniform
     * @param value The value to set
     */
    public setMatrix4(uniName: string, value: number[]) {
        verify.that(uniName, "uniName").isDefined();
        verify.that(value, "value").isDefined().isNotEmpty();

        gl.useProgram(this._shaderProgram);
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniformMatrix4fv(uniform, false, value);
    }

    /**
     * Sets a vec3 in the shader program.
     * @param uniName The name of the uniform
     * @param value The value to set
     */
    public setVector3(uniName: string, value: number[]) {
        verify.that(uniName, "uniName").isDefined();
        verify.that(value, "value").isDefined().isNotEmpty();

        gl.useProgram(this._shaderProgram);
        var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
        gl.uniform3f(uniform, value[0], value[1], value[2]);
    }
}
export = renderObject;
