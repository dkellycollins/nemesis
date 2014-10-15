define(["require", "exports"], function(require, exports) {
    var consoleLogger = (function () {
        function consoleLogger() {
        }
        consoleLogger.log = function (msg) {
            console.log(msg);
        };

        consoleLogger.logError = function (msg, e) {
            console.error(msg);
            if (!!e) {
                console.error(e.toString());
            }
        };
        return consoleLogger;
    })();

    
    return consoleLogger;
});
//# sourceMappingURL=consoleLogger.js.map
