define(["require", "exports"], function(require, exports) {
    var primitive = (function () {
        function primitive(_gl) {
            this._gl = _gl;
        }
        primitive.prototype.drawTriangles = function (numOfPoints) {
            this._gl.viewport(0.0, 0.0, this._gl.canvas.width, this._gl.canvas.height);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT);
            this._gl.drawElements(this._gl.TRIANGLES, numOfPoints, this._gl.UNSIGNED_SHORT, 0);
            this._gl.flush();
        };

        primitive.prototype.createArrayBuffer = function (bufferData) {
            return this.createBuffer(new Float32Array(bufferData), this._gl.ARRAY_BUFFER);
        };

        primitive.prototype.createElementArrayBuffer = function (bufferData) {
            return this.createBuffer(new Uint16Array(bufferData), this._gl.ELEMENT_ARRAY_BUFFER);
        };

        primitive.prototype.createBuffer = function (bufferData, bufferType) {
            var buffer = this._gl.createBuffer();
            this._gl.bindBuffer(bufferType, buffer);
            this._gl.bufferData(bufferType, bufferData, this._gl.STATIC_DRAW);

            return buffer;
        };

        primitive.prototype.deleteBuffer = function (buffer) {
            this._gl.deleteBuffer(buffer);
        };
        return primitive;
    })();

    
    return primitive;
});
//# sourceMappingURL=primitive.js.map
