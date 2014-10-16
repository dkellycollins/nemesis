///<reference path="./shaders.d.ts" />
define(["require", "exports", "../util/logging/consoleLogger", "text!./shader_source/color.vertex", "text!./shader_source/color.fragment"], function(require, exports, logger, colorVertexShader_source, colorFragmentShader_source) {
    var shaders = (function () {
        function shaders(gl) {
            this._gl = gl;
            this.colorVertexShader = this.compile(colorVertexShader_source, this._gl.VERTEX_SHADER);
            this.colorFragmentShader = this.compile(colorFragmentShader_source, this._gl.FRAGMENT_SHADER);
        }
        shaders.prototype.compile = function (source, type) {
            var shader = this._gl.createShader(type);
            this._gl.shaderSource(shader, source);
            this._gl.compileShader(shader);
            if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
                logger.logError("Error compiling shader:" + this._gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };
        return shaders;
    })();
    
    return shaders;
});
//# sourceMappingURL=shaders.js.map
