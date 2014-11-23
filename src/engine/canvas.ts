import logger = require("util/logger/consoleLogger");
import config = require("./config");

var canvas;
if(config.canvasId) {
    canvas = <HTMLCanvasElement>document.getElementById(config.canvasId);
} else {
    canvas = document.getElementsByTagName('canvas')[0];
}

if(config.fullscreen) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export = canvas;
