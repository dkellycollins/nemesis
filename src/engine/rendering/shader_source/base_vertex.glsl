#include common.glsl

attribute vec3 position;
uniform mat4 mvp;

void main(void) {
    gl_Position = getPosition(mvp, position);
}