///<reference path="../util/gl-matrix.d.ts" />
define(["require", "exports", "gl_matrix/vec3"], function(require, exports, vec3) {
    var camera = (function () {
        function camera() {
            this.orientation = vec3.fromValues(Math.PI, 0, 0);
            this.position = vec3.create();
        }
        return camera;
    })();
});
