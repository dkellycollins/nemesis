///<reference path="./logger.d.ts" />

/**
 * Logs messages to the console.
 */
module consoleLogger {
    /**
     * The maximum number of error that can be logged before the logger is disabled.
     * @type {number}
     * @private
     */
    var _MAX_ERRORS_REPORTED = 500;

    /**
     * The total number of errors reported.
     * @type {number}
     * @private
     */
    var _errorsReported: number = 0;

    /**
     * Logs a standard message to the console
     * @param msg The message to log
     */
    export function log(msg: string): void {
        if(_errorsReported > _MAX_ERRORS_REPORTED) {
            return;
        }
        console.log(msg);
    }

    /**
     * Logs an error message to the console
     * @param msg The message to log
     * @param e Error information
     */
    export function logError(msg: string, e?: ExceptionInformation) {
        if(_errorsReported > _MAX_ERRORS_REPORTED) {
            return;
        }

        console.error(msg);
        if(!!e) {
            console.error(e.toString());
        }

        _errorsReported++;
        if(_errorsReported > _MAX_ERRORS_REPORTED) {
            log("Max errors reached. Disabling log.");
        }
    }
}
export = consoleLogger;