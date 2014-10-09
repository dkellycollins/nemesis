///<reference path="./util.d.ts" />
define(["require", "exports"], function(require, exports) {
    var logger = (function () {
        function logger() {
        }
        logger.prototype.log = function (msg) {
            console.log(msg);
        };
        return logger;
    })();

    
    return logger;
});
//# sourceMappingURL=logger.js.map
