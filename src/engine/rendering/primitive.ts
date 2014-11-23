import gl = require("./glContext");
import Logger = require("../util/logger/consoleLogger");

module primitive {
    export function init() {
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
    }

    export function begin(): void {
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    export function end(): void {
        gl.flush();
    }
}
export = primitive;