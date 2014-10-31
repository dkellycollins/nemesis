import Logger = require("./util/logging/consoleLogger");
/*import Rendering = require("./rendering/rendering");
import Util = require("./util/util");*/

var _nemesis;

/* The nemesis module is for static varibles and static initialization. */
module nemesis {
    //export var rendering = Rendering;
    //export var util = Util;

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
            _renderCallbacks.forEach(callback => {
                callback(time, context);
            });
            window.requestAnimationFrame(animateFrame);
        };
        window.requestAnimationFrame(animateFrame);
    }
}
export = nemesis;