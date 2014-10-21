///<reference path="./shaders.d.ts" />

import gl = require("./glContext");
import logger = require("../util/logging/consoleLogger");
import colorVertexShader_source = require("text!./shader_source/color.vertex");
import colorFragmentShader_source = require("text!./shader_source/color.fragment");

module shaders {
    export var colorVertexShader: WebGLShader;
    export var colorFragmentShader: WebGLShader;

    export function compile(source: string, type: number): WebGLShader {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            logger.logError("Error compiling shader:"  + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    colorVertexShader = compile(<string>colorVertexShader_source, gl.VERTEX_SHADER);
    colorFragmentShader = compile(<string>colorFragmentShader_source, gl.FRAGMENT_SHADER);
}
export = shaders;