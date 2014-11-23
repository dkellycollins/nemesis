///<refernece path="./logger.d.ts" />

import config = require("../../config");
import consoleLogger = require("./consoleLogger");

module logger {
    var _loggers: ILogger[] = [];
    _loggers.push(consoleLogger);

    export function log(msg:string):void {
        _.forEach(this._loggers, (logger: ILogger) => {
            logger.log(msg);
        });
    }

    export function logError(msg:string, e?:ExceptionInformation):void {
        _.forEach(this._loggers, (logger: ILogger) => {
            logger.logError(msg, e);
        });
    }
}

export = logger;