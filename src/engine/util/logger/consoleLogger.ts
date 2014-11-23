///<reference path="./logger.d.ts" />

module consoleLogger {
    var _MAX_ERRORS_REPORTED = 500;
    var _maxErrorsReached: boolean = false;
    var _errorsReported: number = 0;

    function _checkErrorsReported() {
        _errorsReported++;
        if(_errorsReported > _MAX_ERRORS_REPORTED) {
            _maxErrorsReached = true;
            log("Max errors reached. Disabling log.");
        }
    }

    export function log(msg: string): void {
        if(_maxErrorsReached) {
            return;
        }
        console.log(msg);
    }

    export function logError(msg: string, e?: ExceptionInformation) {
        if(_maxErrorsReached) {
            return;
        }

        console.error(msg);
        if(!!e) {
            console.error(e.toString());
        }
        _checkErrorsReported();
    }


}
export = consoleLogger;