///<reference path="../../../../lib/lodash/lodash.d.ts" />
define(["require", "exports", "../logger/index", "lodash"], function (require, exports, logger, _) {
    var verifier = (function () {
        function verifier(value, name) {
            this._value = value;
            this._name = name;
        }
        verifier.prototype.isDefined = function () {
            if (_.isUndefined(this._value)) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is undefined"));
            }
            return this;
        };
        verifier.prototype.isNotEmpty = function () {
            if (_.isEmpty(this._value)) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is empty."));
            }
            return this;
        };
        verifier.prototype.isGreaterThan = function (x) {
            if (this._value <= x) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"));
            }
            return this;
        };
        verifier.prototype._getMsg = function (msg) {
            return msg.replace("{name}", this._name).replace("{value}", this._value);
        };
        return verifier;
    })();
    var verify;
    (function (verify) {
        function that(value, name) {
            return new verifier(value, name);
        }
        verify.that = that;
    })(verify || (verify = {}));
    return verify;
});
