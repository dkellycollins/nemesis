///<reference path="../../../../lib/lodash/lodash.d.ts" />

import logger = require("../nemesis.logger/logger/index");
import _ = require("lodash");

/**
 * Provides methods to verify the given parameter.
 */
class verifier {
    /**
     * Create a new verifier.
     * @param value The value to verify
     * @param name The parameter name of the value
     */
    constructor(value: any, name: string) {
        this._value = value;
        this._name = name;
    }

    /**
     * The parameter value
     */
    private _value: any;

    /**
     * The name of the parameter
     */
    private _name: string;

    /**
     * Logs an error if the value is not defined
     * @returns {verifier} This
     */
    public isDefined():verifier {
        if(typeof(this._value) == 'undefined') {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is undefined"));
        }
        return this;
    }

    /**
     * Logs an error if the value is empty
     * @returns {verifier} This
     */
    public isNotEmpty():verifier {
        if(typeof(this._value.length) != 'undefined' && this._value.length == 0) {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is empty."));
        }
        return this;
    }

    /**
     * Logs an error if the value is greater then the given value.
     * @param x The value to compare against
     * @returns {verifier} This
     */
    public isGreaterThan(x: number) {
        if(this._value <= x) {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"));
        }
        return this;
    }

    /**
     * Logs an error if the value is less then the given value.
     * @param x The value to compare against
     * @returns {verifier} This
     */
    public isLessThan(x: number) {
        if(this._value >= x) {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is less than [" + x + "]"));
        }
        return this;
    }

    /**
     * Retrusn the given message with {name} and {value} replaced with _name and _value.
     * @param msg
     * @returns {any}
     * @private
     */
    private _getMsg(msg:string) {
        return msg.replace("{name}", this._name).replace("{value}", this._value);
    }
}

/**
 * Exposes the function to create the verifier.
 */
module verify {
    /**
     * Creates a new verifier with the given value and name
     * @param value THe value of the parameter
     * @param name The name of the parameter
     * @returns {verifier} The new verifier
     */
    export function that(value: any, name: string): verifier {
        return new verifier(value, name);
    }
}

export = verify;