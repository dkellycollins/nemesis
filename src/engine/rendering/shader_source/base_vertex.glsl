#include common.glsl

attribute vec3 aPosition;
uniform vec3 uPosition;
uniform mat4 mvp;

void main(void) {
    gl_Position = getPosition(mvp, aPosition + uPosition);
}