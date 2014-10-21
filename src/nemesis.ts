import Logger = require("./util/logging/consoleLogger");
/*import Rendering = require("./rendering/rendering");
import Util = require("./util/util");*/

/* The nemesis module is for static varibles and static initialization. */
module nemesis {
    //export var rendering = Rendering;
    //export var util = Util;

    var _animate:(time: any, args:any) => void;;
    export function animate(animateFunc: (time: any, args:any) => void, args?: any) {
        _animate = (time, args:any) => {
            animateFunc(time, args);
            window.requestAnimationFrame((t) => {
                _animate(t, args)
            });
        };
        window.requestAnimationFrame((t) => {
            _animate(t, args)
        });
    }
}
export = nemesis;