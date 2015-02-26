attribute vec3 aVertex;
uniform mat4 mvp;

attribute vec2 aUV;
varying vec2 vUV;

void main(void) {
    gl_Position = mvp * vec4(aVertex, 1.);
    vUV = aUV;
}