define(["require", "exports", "./glContext"], function (require, exports, gl) {
    /**
     * Functions to setup and complete each frame.
     */
    var render;
    (function (render) {
        /**
         * Performs initialization for rendering
         */
        function init() {
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        }
        render.init = init;
        /**
         * Begins a new frame
         */
        function begin() {
            gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        render.begin = begin;
        /**
         * Completes a frame
         */
        function end() {
            gl.flush();
        }
        render.end = end;
    })(render || (render = {}));
    return render;
});
