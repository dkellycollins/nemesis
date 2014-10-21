import nemesis = require("../_nemesis");
import logger = require("../util/logging/consoleLogger");
import debug = require("../util/debug/webgl");

function throwOnGLError(err, funcName, args) {
    throw debug.glEnumToString(err) + " was caused by call to: " + funcName;
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
    //logGLCall(functionName, args);
    validateNoneOfTheArgsAreUndefined(functionName, args);
}

var GL: WebGLRenderingContext;
try {
    GL = nemesis.canvas().getContext('experimental-webgl', {antialias:true});
    GL = debug.makeDebugContext(GL, throwOnGLError, logAndValidate);
} catch(e) {
    logger.logError('Error getting webgl context.', e);
}

export = GL;