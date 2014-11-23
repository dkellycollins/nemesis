///<refernece path="./logger.d.ts" />
define(["require", "exports", "./consoleLogger"], function (require, exports, consoleLogger) {
    var logger;
    (function (_logger) {
        var _loggers = [];
        _loggers.push(consoleLogger);
        function log(msg) {
            _.forEach(this._loggers, function (logger) {
                logger.log(msg);
            });
        }
        _logger.log = log;
        function logError(msg, e) {
            _.forEach(this._loggers, function (logger) {
                logger.logError(msg, e);
            });
        }
        _logger.logError = logError;
    })(logger || (logger = {}));
    return logger;
});
