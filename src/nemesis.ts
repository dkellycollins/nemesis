import _nemesis = require("_nemesis");
import Logger = require('util/logging/consoleLogger');
import Rendering = require('rendering/rendering');

/* The nemesis module is for static varibles and static initialization. */
module nemesis {
    export var animate;
    export var rendering;

    if(_nemesis.config().fullscreeen) {
        _nemesis.canvas().width = window.innerWidth;
        _nemesis.canvas().height = window.innerHeight;
    }

    nemesis.animate = _nemesis.animate;
    nemesis.rendering = Rendering;
}
export = nemesis;