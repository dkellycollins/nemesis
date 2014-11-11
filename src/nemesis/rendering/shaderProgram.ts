import gl = require("./glContext");

class attribData {
    constructor(id, index, type, normalize, stride, offset) {
        this.id = id;
        this.index = index;
        this.type = type;
        this.normalize = normalize;
        this.stride = stride;
        this.offset = offset;
    }

    public id;
    public index:number;
    public type;
    public normalize:boolean;
    public stride:number;
    public offset:number;
}

class shaderProgram {
    constructor() {
        this.id = gl.createProgram();
    }

    public id;
    public update: (time: number, args?: any) => void;

    public addShader(shader:WebGLShader[]):void {
        if(shader instanceof Array) {
            shader.forEach(s => {
               gl.attachShader(this.id, s);
            });
        } else {
            gl.attachShader(this.id, shader);
        }
    }

    public init():void {
        gl.linkProgram(this.id);
    }

    public setActive() {
        gl.useProgram(this.id);
    }

    public setAttribDataSource(data:number[]) {
        this._attribDataSource = data;
    }

    public enableAttrib(attribName: string, index: number, stride:number, offset: number) {
        var attrib = gl.getAttribLocation(this.id, attribName);
        gl.enableVertexAttribArray(attrib);
        this._attribData[attribName] = new attribData(attrib, index, gl.FLOAT, false, stride, offset);
        gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, offset);
    }

    public setFloatAttrib(attribName:string, value:number) {
        var attrib = gl.getAttribLocation(this.id, attribName);
        gl.vertexAttrib1f(attrib, value);
    }

    public setMatrix(uniName: string, value: number[]) {
        var uniform = gl.getUniformLocation(this.id, uniName);
        gl.uniformMatrix4fv(uniform, false, value);
    }

    private _attribDataSource: number[];
    private _attribData: {
        [attrib:string]: attribData;
    }
}
export = shaderProgram;
