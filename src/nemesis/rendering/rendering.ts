import gl = require("./glContext");
import Shaders = require("./shaders");
import Render = require("./primitive");
import Logger = require("../util/logging/consoleLogger");
import RenderObject = require("./renderObject");
import Camera = require("./camera");

module rendering {
    export var GL = gl;
    export var shaders = Shaders;
    export var render = Render;
    export var renderObject = RenderObject;
    export var camera = Camera;
}
export = rendering;