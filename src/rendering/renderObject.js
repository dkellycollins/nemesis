define(["require", "exports"], function(require, exports) {
    var renderObject = (function () {
        function renderObject(gl, vertexes, faces, triangles) {
            this._gl = gl;
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
            this._gl.useProgram(this._shaderProgram.Id);
            this._gl.drawElements(this._gl.TRIANGLES, this._triangles, this._gl.UNSIGNED_SHORT, 0);
        };

        renderObject.prototype.clone = function () {
            return null;
        };

        renderObject.prototype.dispose = function () {
            this._gl.deleteBuffer(this._vertexBuffer);
            this._gl.deleteBuffer(this._faceBuffer);
        };

        renderObject.prototype._createArrayBuffer = function (bufferData) {
            return this._createBuffer(new Float32Array(bufferData), this._gl.ARRAY_BUFFER);
        };

        renderObject.prototype._createElementArrayBuffer = function (bufferData) {
            return this._createBuffer(new Uint16Array(bufferData), this._gl.ELEMENT_ARRAY_BUFFER);
        };

        renderObject.prototype._createBuffer = function (bufferData, bufferType) {
            var buffer = this._gl.createBuffer();
            this._gl.bindBuffer(bufferType, buffer);
            this._gl.bufferData(bufferType, bufferData, this._gl.STATIC_DRAW);

            return buffer;
        };
        return renderObject;
    })();
    
    return renderObject;
});
