///<refernece path="./logger.d.ts" />

import consoleLogger = require("./consoleLogger");

/**
 * Logs to the currently active loggers.
 */
class logger implements ILogger {
    /**
     * Default constructor
     */
    constructor() {
        this._loggers.push(consoleLogger);
    }

    /**
     * The actve loggers
     * @type {Array}
     * @private
     */
    private _loggers: ILogger[] = [];

    /**
     * Logs a standard message
     * @param msg The message to log
     */
    public log(msg:string):void {
        _.forEach(this._loggers, (logger: ILogger) => {
            logger.log(msg);
        });
    }

    /**
     * Logs an error message
     * @param msg The error message
     * @param e Error
     */
    public logError(msg:string, e?:ExceptionInformation) {
        _.forEach(this._loggers, (logger: ILogger) => {
            logger.logError(msg, e);
        });
    }
}

var _logger = new logger();
export = _logger;