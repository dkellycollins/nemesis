import gl = require("./glContext");

class shaderProgram {
    constructor() {
        this.Id = gl.createProgram();
    }

    public Id;

    public addShader(shader:WebGLShader[]):void {
        if(shader instanceof Array) {
            shader.forEach(s => {
               gl.attachShader(this.Id, s);
            });
        } else {
            gl.attachShader(this.Id, shader);
        }
    }

    public init():void {
        gl.linkProgram(this.Id);
    }

    public setActive() {
        gl.useProgram(this.Id);
    }

    public enableAttrib(attribName: string, index: number, stride:number, offset: number) {
        var attrib = gl.getAttribLocation(this.Id, attribName);
        gl.enableVertexAttribArray(attrib);
        gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, offset);
    }

    public setFloatAttrib(attribName:string, value:number) {
        var attrib = gl.getAttribLocation(this.Id, attribName);
        gl.vertexAttrib1f(attrib, value);
    }

    public setMatrix(uniName: string, value: number[]) {
        var uniform = gl.getUniformLocation(this.Id, uniName);
        gl.uniformMatrix4fv(uniform, false, value);
    }
}
export = shaderProgram;
