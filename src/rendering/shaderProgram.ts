class shaderProgram {
    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
        this.Id = this._gl.createProgram();
        this._attributes = {};
    }

    public Id;

    private _gl: WebGLRenderingContext;
    private _attributes: {
        [name: string]: number
    };

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
        this._attributes[attribName] = attrib;
    }

    public setFloat(attribName:string, index:number, stride: number, value: number) {
        this._gl.vertexAttribPointer(this._attributes[attribName], index, this._gl.FLOAT, false, stride, value);
    }
}
export = shaderProgram;
