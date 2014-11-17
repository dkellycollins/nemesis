define(["require", "exports", "./glContext", "lodash"], function (require, exports, gl, _) {
    var renderObject = (function () {
        function renderObject(shaderProgram) {
            this._buffer = [];
            this._shaderProgram = shaderProgram;
        }
        renderObject.prototype.setActive = function () {
            gl.useProgram(this._shaderProgram);
        };
        renderObject.prototype.render = function (time, args) {
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
            gl.vertexAttribPointer(attrib, size, gl.FLOAT, false, 0, 0);
            this._buffer.push(buf);
        };
        renderObject.prototype.setMatrix = function (uniName, value) {
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        return renderObject;
    })();
    return renderObject;
});
