///<reference path="../../../../lib/lodash/lodash.d.ts" />

import logger = require("../logger/index");
import _ = require("lodash");

class verifier {
    constructor(value: any, name: string) {
        this._value = value;
        this._name = name;
    }

    private _value: any;
    private _name: string;

    public isDefined():verifier {
        if(_.isUndefined(this._value)) {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is undefined"));
        }
        return this;
    }

    public isNotEmpty():verifier {
        if(_.isEmpty(this._value)) {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is empty."));
        }
        return this;
    }

    public isGreaterThan(x: number) {
        if(this._value <= x) {
            logger.logError(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"));
        }
        return this;
    }

    private _getMsg(msg:string) {
        return msg.replace("{name}", this._name).replace("{value}", this._value);
    }
}

module verify {
    export function that(value: any, name: string): verifier {
        return new verifier(value, name);
    }
}

export = verify;