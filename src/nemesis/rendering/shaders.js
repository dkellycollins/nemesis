///<reference path="./shaders.d.ts" />
define(["require", "exports", "./glContext", "../util/logging/consoleLogger", "text!./shader_source/color.vertex", "text!./shader_source/color.fragment"], function(require, exports, gl, logger, colorVertexShader_source, colorFragmentShader_source) {
    var shaders;
    (function (shaders) {
        shaders.colorVertexShader;
        shaders.colorFragmentShader;

        function compile(source, type) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                logger.logError("Error compiling shader:" + gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
        shaders.compile = compile;

        function createProgram(vertexShader, fragmentShader) {
            var prog = gl.createProgram();
            gl.attachShader(prog, vertexShader);
            gl.attachShader(prog, fragmentShader);
            gl.linkProgram(prog);

            return prog;
        }
        shaders.createProgram = createProgram;

        shaders.colorVertexShader = compile(colorVertexShader_source, gl.VERTEX_SHADER);
        shaders.colorFragmentShader = compile(colorFragmentShader_source, gl.FRAGMENT_SHADER);
    })(shaders || (shaders = {}));
    
    return shaders;
});
