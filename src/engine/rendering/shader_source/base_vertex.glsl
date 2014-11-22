#include common.glsl

attribute vec3 aVertex;
uniform mat4 mvp;

void main(void) {
    gl_Position = mvp * vec4(aVertex, 1.);
}