define(["require", "exports", "util/math/vector3"], function(require, exports, vector3) {
    var camera = (function () {
        function camera() {
            this.orientation = new vector3(Math.PI, 0, 0);
            this.position = vector3.zero();
        }
        return camera;
    })();
});
