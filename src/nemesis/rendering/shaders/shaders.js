var nemesis = nemesis || {};
nemesis.rendering = nemesis.rendering || {};

nemesis.rendering.shaders = {
    "getShader": function(source, type) {
        var shader = nemesis.GL.createShader(type);
        nemesis.GL.shaderSource(shader, source);
        nemesis.GL.compileShader(shader);
        /*if(!nemesis.GL.getShaderParameter(shader, nemesis.GL.COMPLIE_STATUS)) {
            return false;
        }*/
        return shader;
    },
    "getShaderProgram": function(shaders) {
        var SHADER_PROGRAM = nemesis.GL.createProgram();
        for(shader in shaders) {
            nemesis.GL.attachShader(SHADER_PROGRAM, shaders[shader]);
        }
        nemesis.GL.linkProgram(SHADER_PROGRAM);

        return SHADER_PROGRAM;
    },
    "init": function() {
        var shader_vertex = this.getShader(this.vertexShader.shader_vertex_source, nemesis.GL.VERTEX_SHADER);
        var shader_fragment = this.getShader(this.fragmentShader.shader_fragment_source, nemesis.GL.FRAGMENT_SHADER);

        this.SHADER_PROGRAM = this.getShaderProgram([
            shader_vertex,
            shader_fragment
        ]);

        nemesis.GL.useProgram(this.SHADER_PROGRAM);
    },
    "vertexShader": {
        "shader_vertex_source": "\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec3 color; //the color of the point\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vColor=color;\n\
}"
    },
    "fragmentShader": {
        "shader_fragment_source":"\n\
precision mediump float;\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}"
    }
};