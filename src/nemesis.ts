import _nemesis = require("_nemesis");
import Logger = require("util/logging/consoleLogger");
import Rendering = require("rendering/rendering");
import Matrix = require("util/math/matrix");

/* The nemesis module is for static varibles and static initialization. */
module nemesis {
    export var animate = _nemesis.animate;
    export var rendering = Rendering;
    export var matrix = Matrix;

    if(_nemesis.config().fullscreen) {
        _nemesis.canvas().width = window.innerWidth;
        _nemesis.canvas().height = window.innerHeight;
    }
}
export = nemesis;