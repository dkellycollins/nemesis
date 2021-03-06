import canvas = require("../canvas");
import config = require("../config");
import logger = require("../util/logger/consoleLogger");
import debug = require("../util/debug/webgl");

/**
 * Gets the gl context object from the canvas element.
 */

function throwOnGLError(err, funcName, args) {
    if(config.throwOnGLError) {
        throw debug.glEnumToString(err) + " was caused by call to: " + funcName;
    }
}

function logGLCall(functionName, args) {
    logger.log("gl." + functionName + "(" +
        debug.glFunctionArgsToString(functionName, args) + ")");
}

function validateNoneOfTheArgsAreUndefined(functionName, args) {
    for(var ii = 0; ii < args.length; ++ii) {
        if (args[ii] === undefined) {
            logger.logError("undefined passed to gl." + functionName + "(" +
                debug.glFunctionArgsToString(functionName, args) + ")");
        }
    }
}

function logAndValidate(functionName, args) {
    if(config.logGLCalls) {
        logGLCall(functionName, args);
    }
    if(config.validateGLArgs) {
        validateNoneOfTheArgsAreUndefined(functionName, args);
    }
}

var GL: WebGLRenderingContext;
try {
    GL = canvas.getContext('experimental-webgl', {antialias:true});
    GL = debug.makeDebugContext(GL, throwOnGLError, logAndValidate);
} catch(e) {
    logger.logError('Error getting webgl context.', e);
}

export = GL;