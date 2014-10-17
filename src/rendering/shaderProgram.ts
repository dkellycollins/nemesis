class shaderProgram {
    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
        this.Id = this._gl.createProgram();
    }

    public Id;

    private _gl: WebGLRenderingContext;

    public addShader(shader:WebGLShader[]):void {
        if(shader instanceof Array) {
            shader.forEach(s => {
               this._gl.attachShader(this.Id, s);
            });
        } else {
            this._gl.attachShader(this.Id, shader);
        }
    }

    public init():void {
        this._gl.linkProgram(this.Id);
    }

    public setActive() {
        this._gl.useProgram(this.Id);
    }

    public enableAttrib(attribName: string) {
        var attrib = this._gl.getAttribLocation(this.Id, attribName);
        this._gl.enableVertexAttribArray(attrib);
    }

    public setFloatAttrib(attribName:string, index: number, stride:number, value: number) {
        var attrib = this._gl.getAttribLocation(this.Id, attribName);
        this._gl.vertexAttribPointer(attrib, index, this._gl.FLOAT, false, stride, value);
    }

    public setMatrix(uniName: string, value: number[]) {
        var uniform = this._gl.getUniformLocation(this.Id, uniName);
        this._gl.uniformMatrix4fv(uniform, false, value);
    }
}
export = shaderProgram;
