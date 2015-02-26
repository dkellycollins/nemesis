declare class NemesisConfig {
    /*
     * If true the canvas element will be resized to fill the window and keep the size of the window.
     */
    public fullscreen: boolean;

    /*
     * If true, an error will be thrown when WebGL encounters an eror.
     */
    public throwOnGLError: boolean;

    /*
     * If true, will log all calls to web gl.
     */
    public logGLCalls: boolean;

    /*
     * If true, calls to web gl will be checked for undefined parameters. Any calls with undefined parameters will be logged.
     */
    public validateGLArgs: boolean;
}

