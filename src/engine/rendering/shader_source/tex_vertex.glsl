attribute vec3 aPosition;
attribute vec2 aUV;
uniform mat4 mvp;
varying vec2 vUV;

void main(void) {
    gl_Position = mvp * vec4(aPosition, 1.);
    vUV = aUV;
}