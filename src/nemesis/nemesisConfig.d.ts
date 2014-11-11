declare module 'json!config.json' {
    /*
     * The id of the canvas element in the html page. If not provide the fist canvas element on the page will be used.
     */
    export var canvasId: string;

    /*
     * If true the canvas element will be resized to fill the window and keep the size of the window.
     */
    export var fullscreen: boolean;

    /*
     * If true, an error will be thrown when WebGL encounters an eror.
     */
    export var throwOnGLError: boolean;

    /*
     * If true, will log all calls to web gl.
     */
    export var logGLCalls: boolean;

    /*
     * If true, calls to web gl will be checked for undefined parameters. Any calls with undefined parameters will be logged.
     */
    export var validateGLArgs: boolean;
}

