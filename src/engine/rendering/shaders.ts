///<reference path="./shaders.d.ts" />

import gl = require("./glContext");
import logger = require("../util/logging/consoleLogger");
import common = require("text!./shader_source/common.glsl");
import base_vertex = require("text!./shader_source/base_vertex.glsl");
import color_frag = require("text!./shader_source/color_frag.glsl");

/**
 * Handles compiling shaders and creating shader programs.
 */
module shaders {
    export var baseVertexShader: WebGLShader;
    export var colorFragmentShader: WebGLShader;

    /**
     * RegExp for fining include statements in shaders.
     * @type {RegExp}
     */
    var includeReg = /#include \S+/;

    /**
     * Stores lib shaders compiled by compileLib
     * @type {{}}
     */
    var lib: {
        [name:string]:string
    } = {};

    /**
     * Parses the source of a shader.
     * @param source the source for a shader.
     * @returns {string} the parsed source.
     */
    function parseSource(source: string):string {
        source = source.replace(includeReg, (match:string) => {
            var name = match.replace("#include", "").trim();
            if(!lib[name]) {
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
    export function compileLib(name: string, source:string) {
        source = parseSource(source);
        lib[name] = source;
    }

    /**
     * Compiles a shader for use on the gpu.
     * @param source The source of the shader.
     * @param type The type of the shader to compile.
     * @returns {WebGLShader} The handle to the compiled shader.
     */
    export function compile(source: string, type: number): WebGLShader {
        source = parseSource(source);
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            logger.logError("Error compiling shader:"  + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    /**
     * Creates a new program with the given vertex and fragment shaders.
     * @param vertexShader The handle to the compiled vertex shader.
     * @param fragmentShader The handle to the compiled fragment shader.
     * @returns {WebGLProgram} The handle to the shader program.
     */
    export function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        var prog = gl.createProgram();
        gl.attachShader(prog, vertexShader);
        gl.attachShader(prog, fragmentShader);
        gl.linkProgram(prog);

        return prog;
    }

    /* Libraries */
    compileLib("common.glsl", <string>common);

    /* Shaders */
    baseVertexShader = compile(<string>base_vertex, gl.VERTEX_SHADER);
    colorFragmentShader = compile(<string>color_frag, gl.FRAGMENT_SHADER);
}
export = shaders;