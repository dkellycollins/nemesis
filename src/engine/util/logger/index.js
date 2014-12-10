///<refernece path="./logger.d.ts" />
define(["require", "exports", "./consoleLogger"], function (require, exports, consoleLogger) {
    /**
     * Logs to the currently active loggers.
     */
    var logger = (function () {
        /**
         * Default constructor
         */
        function logger() {
            /**
             * The actve loggers
             * @type {Array}
             * @private
             */
            this._loggers = [];
            this._loggers.push(consoleLogger);
        }
        /**
         * Logs a standard message
         * @param msg The message to log
         */
        logger.prototype.log = function (msg) {
            _.forEach(this._loggers, function (logger) {
                logger.log(msg);
            });
        };
        /**
         * Logs an error message
         * @param msg The error message
         * @param e Error
         */
        logger.prototype.logError = function (msg, e) {
            _.forEach(this._loggers, function (logger) {
                logger.logError(msg, e);
            });
        };
        return logger;
    })();
    var _logger = new logger();
    return _logger;
});
