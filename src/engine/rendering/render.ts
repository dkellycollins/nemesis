import gl = require("./glContext");
import Logger = require("../util/logger/consoleLogger");

/**
 * Functions to setup and complete each frame.
 */
module render {
    /**
     * Performs initialization for rendering
     */
    export function init(): void {
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
    }

    /**
     * Begins a new frame
     */
    export function begin(): void {
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Completes a frame
     */
    export function end(): void {
        gl.flush();
    }
}
export = render;