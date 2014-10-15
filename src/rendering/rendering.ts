import nemesis = require("_nemesis");
import Shaders = require("./shaders");
import Render = require("./primitive");
import Logger = require("util/logging/consoleLogger");

module rendering {
    debugger;

    try {
        rendering.GL = nemesis.canvas().getContext('experimental-webgl', {antialias:true});
    } catch(e) {
        Logger.logError('Error getting webgl context.', e);
    }

    export var GL;
    export var shaders = new Shaders(rendering.GL);
    export var render = new Render(rendering.GL);
}

export = rendering;