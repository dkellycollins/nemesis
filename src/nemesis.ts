import _nemesis = require("./_nemesis");
import Logger = require("./util/logging/consoleLogger");
import Rendering = require("./rendering/rendering");
import Util = require("./util/util");

/* The nemesis module is for static varibles and static initialization. */
module nemesis {
    export var animate = _nemesis.animate;
    export var rendering = Rendering;
    export var util = Util;

    if(_nemesis.config().fullscreen) {
        _nemesis.canvas().width = window.innerWidth;
        _nemesis.canvas().height = window.innerHeight;
    }
}
export = nemesis;