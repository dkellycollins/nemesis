define(["require", "exports"], function(require, exports) {
    var vector3 = (function () {
        function vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        vector3.zero = function () {
            return new vector3(0, 0, 0);
        };

        vector3.prototype.add = function (b) {
            return new vector3(this.x + b.x, this.y + b.y, this.z + b.z);
        };
        return vector3;
    })();
    
    return vector3;
});
