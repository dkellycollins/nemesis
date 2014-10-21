define(["require", "exports", "./glContext"], function(require, exports, gl) {
    var primitive;
    (function (primitive) {
        function init() {
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.enable(this._gl.DEPTH_TEST);
            gl.depthFunc(this._gl.LEQUAL);
            gl.clearDepth(1.0);
        }
        primitive.init = init;

        function begin() {
            gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        primitive.begin = begin;

        function end() {
            gl.flush();
        }
        primitive.end = end;
    })(primitive || (primitive = {}));
    
    return primitive;
});
