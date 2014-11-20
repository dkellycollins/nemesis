///<reference path="../../../lib/lodash/lodash.d.ts" />
define(["require", "exports", "./glContext", "lodash"], function (require, exports, gl, _) {
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
            this._buffer = [];
            this._shaderProgram = shaderProgram;
        }
        //private _buffer: WebGLBuffer[] = [];
        renderObject.prototype.render = function (time, args) {
            gl.useProgram(this._shaderProgram);
            _.forEach(this._buffer, function (buffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buf);
                gl.vertexAttribPointer(buffer.attrib, buffer.size, gl.FLOAT, false, 0, 0);
            });
            gl.drawElements(gl.TRIANGLES, this._vertexes, gl.UNSIGNED_SHORT, 0);
        };
        renderObject.prototype.dispose = function () {
            _.forEach(this._buffer, function (buffer) {
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
            var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
            gl.enableVertexAttribArray(attrib);
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            this._buffer.push(new attribData(attrib, size, buf));
        };
        renderObject.prototype.setMatrix4 = function (uniName, value) {
            gl.useProgram(this._shaderProgram);
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        renderObject.prototype.setVector3 = function (uniName, value) {
            gl.useProgram(this._shaderProgram);
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniform3f(uniform, value[0], value[1], value[2]);
        };
        return renderObject;
    })();
    return renderObject;
});
