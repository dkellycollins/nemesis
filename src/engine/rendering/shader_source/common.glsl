#include another_lib

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;

vec4 getPosition(mat4 p, mat4 v, mat4 m, vec3 pos) {
    return p * v * m * vec4(pos, 1);
}