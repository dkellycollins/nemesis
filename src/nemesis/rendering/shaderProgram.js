define(["require", "exports", "./glContext"], function(require, exports, gl) {
    var attribData = (function () {
        function attribData(id, index, type, normalize, stride, offset) {
            this.id = id;
            this.index = index;
            this.type = type;
            this.normalize = normalize;
            this.stride = stride;
            this.offset = offset;
        }
        return attribData;
    })();

    var shaderProgram = (function () {
        function shaderProgram() {
            this.id = gl.createProgram();
        }
        shaderProgram.prototype.addShader = function (shader) {
            var _this = this;
            if (shader instanceof Array) {
                shader.forEach(function (s) {
                    gl.attachShader(_this.id, s);
                });
            } else {
                gl.attachShader(this.is, shader);
            }
        };

        shaderProgram.prototype.init = function () {
            gl.linkProgram(this.id);
        };

        shaderProgram.prototype.setActive = function () {
            gl.useProgram(this.id);
        };

        shaderProgram.prototype.setAttribDataSource = function (data) {
            this._attribDataSource = data;
        };

        shaderProgram.prototype.enableAttrib = function (attribName, index, stride, offset) {
            var attrib = gl.getAttribLocation(this.id, attribName);
            gl.enableVertexAttribArray(attrib);
            this._attribData[attribName] = new attribData(attrib, index, gl.FLOAT, false, stride, offset);
            gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, offset);
        };

        shaderProgram.prototype.setFloatAttrib = function (attribName, value) {
            var attrib = gl.getAttribLocation(this.id, attribName);
            gl.vertexAttrib1f(attrib, value);
        };

        shaderProgram.prototype.setMatrix = function (uniName, value) {
            var uniform = gl.getUniformLocation(this.id, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        return shaderProgram;
    })();
    
    return shaderProgram;
});
