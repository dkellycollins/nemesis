define(["require", "exports", "./glContext"], function(require, exports, gl) {
    var shaderProgram = (function () {
        function shaderProgram() {
            this.Id = gl.createProgram();
        }
        shaderProgram.prototype.addShader = function (shader) {
            var _this = this;
            if (shader instanceof Array) {
                shader.forEach(function (s) {
                    gl.attachShader(_this.Id, s);
                });
            } else {
                gl.attachShader(this.Id, shader);
            }
        };

        shaderProgram.prototype.init = function () {
            gl.linkProgram(this.Id);
        };

        shaderProgram.prototype.setActive = function () {
            gl.useProgram(this.Id);
        };

        shaderProgram.prototype.enableAttrib = function (attribName) {
            var attrib = gl.getAttribLocation(this.Id, attribName);
            gl.enableVertexAttribArray(attrib);
        };

        shaderProgram.prototype.setFloatAttrib = function (attribName, index, stride, value) {
            var attrib = gl.getAttribLocation(this.Id, attribName);
            gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, value);
        };

        shaderProgram.prototype.setMatrix = function (uniName, value) {
            var uniform = gl.getUniformLocation(this.Id, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        return shaderProgram;
    })();
    
    return shaderProgram;
});
