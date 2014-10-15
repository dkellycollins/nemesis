import logger = require("../util/logging/consoleLogger");

class shaders {
    constructor(
        private _gl) {}

    public createProgram():number {
        return this._gl.createProgram();
    }

    public compile(source: string, type: string, program?:number):number {
        var shader = this._gl.createShader(type);
        this._gl.shaderSource(shader, source);
        this._gl.compileShader(shader);
        if(!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
            logger.logError("Error compiling shader:"  + this._gl.getShaderInfoLog(shader));
            return null;
        }

        if(!!program) {
            this._gl.attachShader(program, shader);
        }
        return shader;
    }

    public linkProgram(program:number): void {
        this._gl.linkProgram(program);
    }

    public setFloat(program: number, attribName:string, index: number, stride:number, pointer:number) {
        var attrib = this._gl.getAttributeLocation(program, attribName);
        this._gl.vertexAttribPointer(attrib, index, this._gl.FLOAT, false, stride, pointer);
    }
}
export = shaders;