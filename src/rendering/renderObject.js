define(["require", "exports", "./glContext"], function(require, exports, gl) {
    var renderObject = (function () {
        function renderObject(gl, vertexes, faces, triangles) {
            this._triangles = triangles;
            this._vertexBuffer = this._createArrayBuffer(vertexes);
            this._faceBuffer = this._createElementArrayBuffer(faces);
        }
        renderObject.prototype.setShader = function (shader) {
            this._shaderProgram = shader;
        };

        renderObject.prototype.getShader = function () {
            return this._shaderProgram;
        };

        renderObject.prototype.render = function () {
            gl.useProgram(this._shaderProgram.Id);
            gl.drawElements(gl.TRIANGLES, this._triangles, gl.UNSIGNED_SHORT, 0);
        };

        renderObject.prototype.clone = function () {
            return null;
        };

        renderObject.prototype.dispose = function () {
            gl.deleteBuffer(this._vertexBuffer);
            gl.deleteBuffer(this._faceBuffer);
        };

        renderObject.prototype._createArrayBuffer = function (bufferData) {
            return this._createBuffer(new Float32Array(bufferData), gl.ARRAY_BUFFER);
        };

        renderObject.prototype._createElementArrayBuffer = function (bufferData) {
            return this._createBuffer(new Uint16Array(bufferData), gl.ELEMENT_ARRAY_BUFFER);
        };

        renderObject.prototype._createBuffer = function (bufferData, bufferType) {
            var buffer = gl.createBuffer();
            gl.bindBuffer(bufferType, buffer);
            gl.bufferData(bufferType, bufferData, gl.STATIC_DRAW);

            return buffer;
        };
        return renderObject;
    })();
    
    return renderObject;
});
