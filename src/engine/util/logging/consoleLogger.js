define(["require", "exports"], function (require, exports) {
    var consoleLogger;
    (function (consoleLogger) {
        var _MAX_ERRORS_REPORTED = 500;
        var _maxErrorsReached = false;
        var _errorsReported = 0;
        function _checkErrorsReported() {
            _errorsReported++;
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                _maxErrorsReached = true;
                log("Max errors reached. Disabling log.");
            }
        }
        function log(msg) {
            if (_maxErrorsReached) {
                return;
            }
            console.log(msg);
        }
        consoleLogger.log = log;
        function logError(msg, e) {
            if (_maxErrorsReached) {
                return;
            }
            console.error(msg);
            if (!!e) {
                console.error(e.toString());
            }
            _checkErrorsReported();
        }
        consoleLogger.logError = logError;
    })(consoleLogger || (consoleLogger = {}));
    return consoleLogger;
});
