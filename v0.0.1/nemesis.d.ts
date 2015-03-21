/// <reference path="../lib/es6/es6-promise.d.ts" />
/// <reference path="../lib/node/node.d.ts" />
/**
 * The entry point class. Contains reference to other modules and manages the game loop.
 */
declare module nemesis {
    /***** EventObject *****/
    /**
     * An object that can emit events.
     */
    class eventObject {
        /**
         * Default constructor.
         */
        constructor();
        private _events;
        /**
         * Registers an event handler. When the given event is emitted, the given handler will be called.
         * @param eventName The name of the event.
         * @param handler The function to call when the event is emitted.
         * @returns a function to remove the provided handler from the event.
         */
        on(eventName: string, handler: (...args: any[]) => void): () => void;
        /**
         * Emits the given event. Only objects that inherite eventObject should call this method.
         * @param eventName The name of the event.
         * @param args The arguments to pass to the event handlers.
         */
        emit(eventName: string, ...args: any[]): void;
    }
    function init(context?: any): void;
    /**
     * Starts the game.
     * @param context An object that gets passed to each function, each time a frame is rendered.
     */
    function run(context?: any): void;
    function quit(): void;
    function on(event: string, callback: (any) => void): () => void;
    /***** Config *****/
    interface NemesisConfig {
        fullscreen: boolean;
        throwOnGLError: boolean;
        logGLCalls: boolean;
        validateGLArgs: boolean;
        logLevel: number;
    }
    function config(c?: any): NemesisConfig;
    /***** Logger *****/
    enum logLevel {
        ALL = 0,
        ERROR = 1,
        WARN = 2,
        INFO = 3,
        OFF = 100,
    }
    interface ILogWriter {
        error(message: string, error: ExceptionInformation): any;
        warn(message: string, error?: ExceptionInformation): any;
        info(message: string): any;
    }
    module logger {
        function addWriter(writer: ILogWriter): void;
        function removeWriter(writer: ILogWriter): void;
        /**
         * Generic log function.
         * @param logLevel
         * @param message
         * @param error
         */
        function log(level: logLevel, message: string, error?: ExceptionInformation): void;
        function error(message: string, error: ExceptionInformation): void;
        function warn(message: string, error?: ExceptionInformation): void;
        function info(message: string): void;
    }
    class consoleLogger implements ILogWriter {
        constructor();
        error(message: string, error: ExceptionInformation): void;
        warn(message: string, error?: ExceptionInformation): void;
        info(message: string): void;
    }
    /**
     * The canvas element on the page.
     * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
     */
    function canvas(): Promise<HTMLCanvasElement>;
    /***** Verifier *****/
    /**
     * Provides methods to verify the given parameter.
     */
    class verifier {
        /**
         * Create a new verifier.
         * @param value The value to verify
         * @param name The parameter name of the value
         */
        constructor(value: any, name: string);
        /**
         * The parameter value
         */
        private _value;
        /**
         * The name of the parameter
         */
        private _name;
        /**
         * Logs an error if the value is not defined
         * @returns {verifier} This
         */
        isDefined(): verifier;
        /**
         * Logs an error if the value is empty
         * @returns {verifier} This
         */
        isNotEmpty(): verifier;
        /**
         * Logs an error if the value is greater then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        isGreaterThan(x: number): verifier;
        /**
         * Logs an error if the value is less then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        isLessThan(x: number): verifier;
        /**
         * Retrusn the given message with {name} and {value} replaced with _name and _value.
         * @param msg
         * @returns {any}
         * @private
         */
        private _getMsg(msg);
    }
    /**
     * Exposes the function to create the verifier.
     */
    module verify {
        /**
         * Creates a new verifier with the given value and name
         * @param value THe value of the parameter
         * @param name The name of the parameter
         * @returns {verifier} The new verifier
         */
        function that(value: any, name: string): verifier;
    }
}
