import nemesis = require("../_nemesis");
import logger = require("../util/logging/consoleLogger");

var GL: WebGLRenderingContext;
try {
    GL = nemesis.canvas().getContext('experimental-webgl', {antialias:true});
} catch(e) {
    logger.logError('Error getting webgl context.', e);
}

export = GL;