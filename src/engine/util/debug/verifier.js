///<reference path="../../../../lib/lodash/lodash.d.ts" />
define(["require", "exports", "../logger/index"], function (require, exports, logger) {
    /**
     * Provides methods to verify the given parameter.
     */
    var verifier = (function () {
        /**
         * Create a new verifier.
         * @param value The value to verify
         * @param name The parameter name of the value
         */
        function verifier(value, name) {
            this._value = value;
            this._name = name;
        }
        /**
         * Logs an error if the value is not defined
         * @returns {verifier} This
         */
        verifier.prototype.isDefined = function () {
            if (typeof (this._value) == 'undefined') {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is undefined"));
            }
            return this;
        };
        /**
         * Logs an error if the value is empty
         * @returns {verifier} This
         */
        verifier.prototype.isNotEmpty = function () {
            if (typeof (this._value.length) != 'undefined' && this._value.length == 0) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is empty."));
            }
            return this;
        };
        /**
         * Logs an error if the value is greater then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        verifier.prototype.isGreaterThan = function (x) {
            if (this._value <= x) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"));
            }
            return this;
        };
        /**
         * Logs an error if the value is less then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        verifier.prototype.isLessThan = function (x) {
            if (this._value >= x) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is less than [" + x + "]"));
            }
            return this;
        };
        /**
         * Retrusn the given message with {name} and {value} replaced with _name and _value.
         * @param msg
         * @returns {any}
         * @private
         */
        verifier.prototype._getMsg = function (msg) {
            return msg.replace("{name}", this._name).replace("{value}", this._value);
        };
        return verifier;
    })();
    /**
     * Exposes the function to create the verifier.
     */
    var verify;
    (function (verify) {
        /**
         * Creates a new verifier with the given value and name
         * @param value THe value of the parameter
         * @param name The name of the parameter
         * @returns {verifier} The new verifier
         */
        function that(value, name) {
            return new verifier(value, name);
        }
        verify.that = that;
    })(verify || (verify = {}));
    return verify;
});
