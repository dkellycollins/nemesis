define(["require", "exports"], function(require, exports) {
    var shaderProgram = (function () {
        function shaderProgram(gl) {
            this._gl = gl;
            this.Id = this._gl.createProgram();
            this._attributes = {};
        }
        shaderProgram.prototype.addShader = function (shader) {
            var _this = this;
            if (shader instanceof Array) {
                shader.forEach(function (s) {
                    _this._gl.attachShader(_this.Id, s);
                });
            } else {
                this._gl.attachShader(this.Id, shader);
            }
        };

        shaderProgram.prototype.init = function () {
            this._gl.linkProgram(this.Id);
        };

        shaderProgram.prototype.setActive = function () {
            this._gl.useProgram(this.Id);
        };

        shaderProgram.prototype.enableAttrib = function (attribName) {
            var attrib = this._gl.getAttribLocation(this.Id, attribName);
            this._gl.enableVertexAttribArray(attrib);
            this._attributes[attribName] = attrib;
        };

        shaderProgram.prototype.setFloat = function (attribName, index, stride, value) {
            this._gl.vertexAttribPointer(this._attributes[attribName], index, this._gl.FLOAT, false, stride, value);
        };
        return shaderProgram;
    })();
    
    return shaderProgram;
});
