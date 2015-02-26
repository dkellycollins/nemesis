vec4 getPosition(mat4 mvp, vec3 pos) {
    return mvp * vec4(pos, 1);
}