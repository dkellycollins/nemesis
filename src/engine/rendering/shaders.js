///<reference path="./shaders.d.ts" />
define(["require", "exports", "./glContext", "../util/logger/consoleLogger", "text!../shaders/common.glsl", "text!../shaders/base_vertex.glsl", "text!../shaders/color_frag.glsl", "text!../shaders/tex_frag.glsl", "text!../shaders/tex_vertex.glsl"], function (require, exports, gl, logger, common, base_vertex, color_frag, tex_frag, tex_vertex) {
    /**
     * Handles compiling shaders and creating shader programs.
     */
    var shaders;
    (function (shaders) {
        /**
         * RegExp for fining include statements in shaders.
         * @type {RegExp}
         */
        var includeReg = /#include \S+/;
        /**
         * Stores lib shaders compiled by compileLib
         * @type {{}}
         */
        var lib = {};
        /**
         * Parses the source of a shader.
         * @param source the source for a shader.
         * @returns {string} the parsed source.
         */
        function parseSource(source) {
            source = source.replace(includeReg, function (match) {
                var name = match.replace("#include", "").trim();
                if (!lib[name]) {
                    logger.logError("Shader lib [" + name + "] not found.");
                    return "";
                }
                return lib[name];
            });
            return source;
        }
        /**
         * Compiles the given source a library to be included in other shaders.
         * @param name The name of the library. Generally this should be the file name of the library.
         * @param source The source.
         */
        function compileLib(name, source) {
            source = parseSource(source);
            lib[name] = source;
        }
        shaders.compileLib = compileLib;
        /**
         * Compiles a shader for use on the gpu.
         * @param source The source of the shader.
         * @param type The type of the shader to compile.
         * @returns {WebGLShader} The handle to the compiled shader.
         */
        function compile(source, type) {
            source = parseSource(source);
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
        /**
         * Creates a new program with the given vertex and fragment shaders.
         * @param vertexShader The handle to the compiled vertex shader.
         * @param fragmentShader The handle to the compiled fragment shader.
         * @returns {WebGLProgram} The handle to the shader program.
         */
        function createProgram(vertexShader, fragmentShader) {
            var prog = gl.createProgram();
            gl.attachShader(prog, vertexShader);
            gl.attachShader(prog, fragmentShader);
            gl.linkProgram(prog);
            return prog;
        }
        shaders.createProgram = createProgram;
        /* Libraries */
        compileLib("common.glsl", common);
        /* Shaders */
        shaders.baseVertexShader = compile(base_vertex, gl.VERTEX_SHADER);
        shaders.colorFragmentShader = compile(color_frag, gl.FRAGMENT_SHADER);
        shaders.textureVertexShader = compile(tex_vertex, gl.VERTEX_SHADER);
        shaders.textureFragmentShader = compile(tex_frag, gl.FRAGMENT_SHADER);
    })(shaders || (shaders = {}));
    return shaders;
});
