import _input = require('./input/index');
import _math = require('./math/index');
import _rendering = require('./rendering/index');
import _canvas = require("./canvas");
import _config = require("./config");

/* The engine module is for static varibles and static initialization. */
module nemesis {
    export var input = _input;
    export var math = _math;
    export var rendering = _rendering;
    export var canvas = _canvas;
    export var config = _config;

    var _updateCallbacks: any[] = [];
    var _renderCallbacks: any[] = [];

    export function registerUpdateCallback(update: (time:any, context: any) => void):number {
        return _updateCallbacks.push(update);
    }

    export function deregisterUpdateCallback(updateIndex: number):void {
        _updateCallbacks.splice(updateIndex, 1);
    }

    export function registerRenderCallback(render: (time:any, context: any) => void): number {
        return _renderCallbacks.push(render);
    }

    export function deregisterRenderCallback(renderIndex: number):void {
        _renderCallbacks.splice(renderIndex, 1);
    }

    export function run(context?:any):void {
        var animateFrame = (time) => {
            _updateCallbacks.forEach(callback => {
                callback(time, context);
            });
            _rendering.render.begin();
            _renderCallbacks.forEach(callback => {
                callback(time, context);
            });
            _rendering.render.end();
            window.requestAnimationFrame(animateFrame);
        };
        window.requestAnimationFrame(animateFrame);
    }
}
export = nemesis;