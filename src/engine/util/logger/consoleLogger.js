///<reference path="./logger.d.ts" />
define(["require", "exports"], function (require, exports) {
    /**
     * Logs messages to the console.
     */
    var consoleLogger;
    (function (consoleLogger) {
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
        var _errorsReported = 0;
        /**
         * Logs a standard message to the console
         * @param msg The message to log
         */
        function log(msg) {
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                return;
            }
            console.log(msg);
        }
        consoleLogger.log = log;
        /**
         * Logs an error message to the console
         * @param msg The message to log
         * @param e Error information
         */
        function logError(msg, e) {
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                return;
            }
            console.error(msg);
            if (!!e) {
                console.error(e.toString());
            }
            _errorsReported++;
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                log("Max errors reached. Disabling log.");
            }
        }
        consoleLogger.logError = logError;
    })(consoleLogger || (consoleLogger = {}));
    return consoleLogger;
});
