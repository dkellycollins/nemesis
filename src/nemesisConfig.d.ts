declare module 'json!config.json' {}

interface NemesisConfig {
    /*
     * The id of the canvas element in the html page. If not provide the fist canvas element on the page will be used.
     */
    canvasId: string;

    /*
     * If true the canvas element will be resized to fill the window and keep the size of the window.
     */
    fullscreen: boolean;

    /*
     * If true, an error will be thrown when WebGL encounters an eror.
     */
    throwOnGLError: boolean;

    /*
     * If true, will log all calls to web gl.
     */
    logGLCalls: boolean;

    /*
     * If true, calls to web gl will be checked for undefined parameters. Any calls with undefined parameters will be logged.
     */
    validateGLArgs: boolean;
}