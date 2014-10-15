define(["require", "exports", "../util/logging/consoleLogger"], function(require, exports, logger) {
    var shaders = (function () {
        function shaders(_gl) {
            this._gl = _gl;
        }
        shaders.prototype.createProgram = function () {
            return this._gl.createProgram();
        };

        shaders.prototype.compileFragementShader = function (source, program) {
            return this.compile(source, this._gl.FRAGMENT_SHADER, program);
        };

        shaders.prototype.compileVertexShader = function (source, program) {
            return this.compile(source, this._gl.VERTEX_SHADER, program);
        };

        shaders.prototype.compile = function (source, type, program) {
            var shader = this._gl.createShader(type);
            this._gl.shaderSource(shader, source);
            this._gl.compileShader(shader);
            if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
                logger.logError("Error compiling shader:" + this._gl.getShaderInfoLog(shader));
                return null;
            }

            if (!!program) {
                this._gl.attachShader(program, shader);
            }
            return shader;
        };

        shaders.prototype.linkProgram = function (program) {
            this._gl.linkProgram(program);
        };

        shaders.prototype.setActiveProgram = function (program) {
            this._gl.useProgram(program);
        };

        shaders.prototype.setFloat = function (program, attribName, index, stride, pointer) {
            var attrib = this._gl.getAttribLocation(program, attribName);
            this._gl.vertexAttribPointer(attrib, index, this._gl.FLOAT, false, stride, pointer);
        };
        return shaders;
    })();
    
    return shaders;
});
//# sourceMappingURL=shaders.js.map
