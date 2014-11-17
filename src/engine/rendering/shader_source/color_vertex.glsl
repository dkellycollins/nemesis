#include common.glsl

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
void main(void) { //pre-built function
    gl_Position = getPosition(Pmatrix, Vmatrix, Mmatrix, position);
    vColor=color;
}