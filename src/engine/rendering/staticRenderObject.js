///<reference path="../../../lib/lodash/lodash.d.ts" />
define(["require", "exports", "./glContext", "lodash", "../math/index", "../util/debug/verifier"], function (require, exports, gl, _, math, verify) {
    var attribData = (function () {
        function attribData(attrib, size, buf) {
            this.attrib = attrib;
            this.size = size;
            this.buf = buf;
        }
        return attribData;
    })();
    var renderObject = (function () {
        function renderObject(shaderProgram) {
            this._attribs = [];
            this._shaderProgram = shaderProgram;
            this._modelMat = math.mat4.create();
            this._mvp = math.mat4.create();
        }
        renderObject.prototype.modelMatrix = function (m) {
            if (!!m) {
                math.mat4.copy(this._modelMat, m);
            }
            return math.mat4.clone(this._modelMat);
        };
        renderObject.prototype.camera = function (c) {
            if (!!c) {
                this._camera = c;
            }
            return this._camera;
        };
        renderObject.prototype.texture = function (t) {
            if (!!t) {
                this._texture = t;
            }
            return this._texture;
        };
        renderObject.prototype.render = function (time, args) {
            gl.useProgram(this._shaderProgram);
            //Set mvp matrix.
            this.setMatrix4("mvp", math.mat4.mul(this._mvp, this._camera.projectionView(), this._modelMat));
            //If we have a texture activate it
            if (!!this._texture && this._texture.loaded()) {
                this._texture.activate();
            }
            //Reactivate the shader attributes.
            _.forEach(this._attribs, function (attrib) {
                gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buf);
                gl.vertexAttribPointer(attrib.attrib, attrib.size, gl.FLOAT, false, 0, 0);
            });
            //Draw!
            gl.drawElements(gl.TRIANGLES, this._vertexes, gl.UNSIGNED_SHORT, 0);
        };
        renderObject.prototype.dispose = function () {
            _.forEach(this._attribs, function (buffer) {
                gl.deleteBuffer(buffer);
            });
        };
        renderObject.prototype.setVertexes = function (vertexes) {
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexes), gl.STATIC_DRAW);
            this._vertexes = vertexes.length;
        };
        renderObject.prototype.enableAttrib = function (attribName, size, data) {
            verify.that(size, "size").isDefined().isGreaterThan(0);
            verify.that(data, "data").isDefined().isNotEmpty();
            var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
            gl.enableVertexAttribArray(attrib);
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            this._attribs.push(new attribData(attrib, size, buf));
        };
        renderObject.prototype.setMatrix4 = function (uniName, value) {
            verify.that(value, "value").isDefined().isNotEmpty();
            gl.useProgram(this._shaderProgram);
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        renderObject.prototype.setVector3 = function (uniName, value) {
            verify.that(value, "value").isDefined().isNotEmpty();
            gl.useProgram(this._shaderProgram);
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniform3f(uniform, value[0], value[1], value[2]);
        };
        return renderObject;
    })();
    return renderObject;
});