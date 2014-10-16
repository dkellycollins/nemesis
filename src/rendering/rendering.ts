import nemesis = require("_nemesis");
import Shaders = require("./shaders");
import ShaderProgram = require("./shaderProgram");
import Render = require("./primitive");
import Logger = require("util/logging/consoleLogger");

module rendering {
    export var GL: WebGLRenderingContext;
    try {
        rendering.GL = nemesis.canvas().getContext('experimental-webgl', {antialias:true});
    } catch(e) {
        Logger.logError('Error getting webgl context.', e);
    }

    export var shaders = new Shaders(rendering.GL);
    export var shaderProgram = () => new ShaderProgram(rendering.GL);
    export var render = new Render(rendering.GL);
}

export = rendering;