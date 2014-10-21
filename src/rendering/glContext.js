define(["require", "exports", "../_nemesis", "../util/logging/consoleLogger"], function(require, exports, nemesis, logger) {
    var GL;
    try  {
        GL = nemesis.canvas().getContext('experimental-webgl', { antialias: true });
    } catch (e) {
        logger.logError('Error getting webgl context.', e);
    }

    
    return GL;
});
