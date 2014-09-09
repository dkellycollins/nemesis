var nemesis = nemesis || {};
nemesis.resources = nemesis.resources || {};

nemesis.resources.cube = {};
nemesis.resources.cube.vertex = [
    -1,-1,-1,     1,1,0,
    1,-1,-1,     1,1,0,
    1, 1,-1,     1,1,0,
    -1, 1,-1,     1,1,0,

    -1,-1, 1,     0,0,1,
    1,-1, 1,     0,0,1,
    1, 1, 1,     0,0,1,
    -1, 1, 1,     0,0,1,

    -1,-1,-1,     0,1,1,
    -1, 1,-1,     0,1,1,
    -1, 1, 1,     0,1,1,
    -1,-1, 1,     0,1,1,

    1,-1,-1,     1,0,0,
    1, 1,-1,     1,0,0,
    1, 1, 1,     1,0,0,
    1,-1, 1,     1,0,0,

    -1,-1,-1,     1,0,1,
    -1,-1, 1,     1,0,1,
    1,-1, 1,     1,0,1,
    1,-1,-1,     1,0,1,

    -1, 1,-1,     0,1,0,
    -1, 1, 1,     0,1,0,
    1, 1, 1,     0,1,0,
    1, 1,-1,     0,1,0
];
nemesis.resources.cube.faces = [
    0,1,2,
    0,2,3,

    4,5,6,
    4,6,7,

    8,9,10,
    8,10,11,

    12,13,14,
    12,14,15,

    16,17,18,
    16,18,19,

    20,21,22,
    20,22,23
];
nemesis.resources.cube.init = function() {
    this.CUBE_VERTEX= nemesis.GL.createBuffer();
    nemesis.GL.bindBuffer(nemesis.GL.ARRAY_BUFFER, this.CUBE_VERTEX);
    nemesis.GL.bufferData(nemesis.GL.ARRAY_BUFFER,
        new Float32Array(this.cube_vertex),
        nemesis.GL.STATIC_DRAW);

    this.CUBE_FACES= nemesis.GL.createBuffer();
    nemesis.GL.bindBuffer(nemesis.GL.ELEMENT_ARRAY_BUFFER, this.CUBE_FACES);
    nemesis.GL.bufferData(nemesis.GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(this.cube_faces),
        nemesis.GL.STATIC_DRAW);
};