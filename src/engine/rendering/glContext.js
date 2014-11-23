define(["require", "exports", "../canvas", "../config", "../util/logger/consoleLogger", "../util/debug/webgl"], function (require, exports, canvas, config, logger, debug) {
    function throwOnGLError(err, funcName, args) {
        if (config.throwOnGLError) {
            throw debug.glEnumToString(err) + " was caused by call to: " + funcName;
        }
    }
    function logGLCall(functionName, args) {
        logger.log("gl." + functionName + "(" + debug.glFunctionArgsToString(functionName, args) + ")");
    }
    function validateNoneOfTheArgsAreUndefined(functionName, args) {
        for (var ii = 0; ii < args.length; ++ii) {
            if (args[ii] === undefined) {
                logger.logError("undefined passed to gl." + functionName + "(" + debug.glFunctionArgsToString(functionName, args) + ")");
            }
        }
    }
    function logAndValidate(functionName, args) {
        if (config.logGLCalls) {
            logGLCall(functionName, args);
        }
        if (config.validateGLArgs) {
            validateNoneOfTheArgsAreUndefined(functionName, args);
        }
    }
    var GL;
    try {
        GL = canvas.getContext('experimental-webgl', { antialias: true });
        GL = debug.makeDebugContext(GL, throwOnGLError, logAndValidate);
    }
    catch (e) {
        logger.logError('Error getting webgl context.', e);
    }
    return GL;
});
