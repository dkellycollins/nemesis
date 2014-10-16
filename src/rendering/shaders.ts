///<reference path="./shaders.d.ts" />

import logger = require("../util/logging/consoleLogger");
import colorVertexShader_source = require("text!./shader_source/color.vertex");
import colorFragmentShader_source = require("text!./shader_source/color.fragment");

class shaders {
    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
        this.colorVertexShader = this.compile(<string>colorVertexShader_source, this._gl.VERTEX_SHADER);
        this.colorFragmentShader = this.compile(<string>colorFragmentShader_source, this._gl.FRAGMENT_SHADER);
    }

    public colorVertexShader: WebGLShader;
    public colorFragmentShader: WebGLShader;

    private _gl: WebGLRenderingContext;

    public compile(source: string, type: number): WebGLShader {
        var shader = this._gl.createShader(type);
        this._gl.shaderSource(shader, source);
        this._gl.compileShader(shader);
        if(!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
            logger.logError("Error compiling shader:"  + this._gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}
export = shaders;