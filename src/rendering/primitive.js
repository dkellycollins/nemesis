define(["require", "exports"], function(require, exports) {
    var primitive = (function () {
        function primitive(gl) {
            this._gl = gl;

            this._gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this._gl.enable(this._gl.DEPTH_TEST);
            this._gl.depthFunc(this._gl.LEQUAL);
            this._gl.clearDepth(1.0);
        }
        primitive.prototype.begin = function () {
            this._gl.viewport(0.0, 0.0, this._gl.canvas.width, this._gl.canvas.height);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
        };

        primitive.prototype.end = function () {
            this._gl.flush();
        };
        return primitive;
    })();

    
    return primitive;
});
