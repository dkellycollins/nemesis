///<reference path="../util/gl-matrix.d.ts" />

import vec3 = require("gl_matrix/vec3");

class camera {
    public orientation: vec3 = vec3.fromValues(Math.PI, 0, 0);
    public position:vec3 = vec3.create();

    public
}
