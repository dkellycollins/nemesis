define(["require", "exports", "util/math/vec3", "util/math/mat4"], function(require, exports, vec3, mat4) {
    var camera = (function () {
        function camera() {
            this.orientation = vec3.fromValues(Math.PI, 0, 0);
            this.position = vec3.create();
        }
        camera.prototype.getViewMatrix = function () {
            var lookat = vec3.fromValues(Math.sin(this.orientation[0]) * Math.cos(this.orientation[1]), Math.sin(this.orientation[1]), Math.cos(this.orientation[0]) * Math.cos(this.orientation[2]));
            vec3.add(lookat, this.position, lookat);
            return mat4.lookAt(mat4.create(), this.position, lookat, vec3.UNIT_Y);
        };

        camera.prototype.move = function (x, y, z, speed) {
            var forward = vec3.fromValues(Math.sin(this.orientation[0]), 0, Math.cos(this.orientation[0]));
            var right = vec3.fromValues(-forward[2], 0, forward[2]);
            var offset = vec3.create();
            var o = vec3.create();
            vec3.add(offset, offset, vec3.scale(o, right, x));
            vec3.add(offset, offset, vec3.scale(o, forward, y));
            offset[1] += z;

            vec3.normalize(offset, offset);
            vec3.scale(offset, offset, speed);
            vec3.add(this.position, this.position, offset);
        };

        camera.prototype.reset = function () {
            vec3.set(this.position, 0, 0, 0);
            vec3.set(this.orientation, Math.PI, 0, 0);
        };

        camera.prototype.rotate = function (x, y) {
            this.orientation[0] = (this.orientation[0] + x) % (Math.PI * 2);
            this.orientation[1] = Math.max(Math.min(this.orientation[1] + y, (Math.PI / 2 - 0.1)), -Math.PI / 2 + 0.1);
        };
        return camera;
    })();
    
    return camera;
});
