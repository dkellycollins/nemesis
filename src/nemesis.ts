declare var require:(moduleId:string) => any;
var config: nemesis.Config = require('json!config.json');

import Logger = require('util/logger');

class nemesis {
    private static _config: nemesis.Config;
    public static config(c?: nemesis.Config): nemesis.Config {
        if (!!c) {
            this._config = c;
        }
        return this._config || <nemesis.Config>{};
    }

    public static GL;
    public static CANVAS;
    public static LOGGER: ILogger;
}

module nemesis {
    export interface Config {
        canvasId: string;
        fullscreeen: boolean;
    }

    //Set config.
    nemesis.config(config);

    //Setup logger.
    nemesis.LOGGER = new Logger();

    if(!!nemesis.config().canvasId) {
        nemesis.CANVAS = document.getElementById(nemesis.config().canvasId);
    } else {
        nemesis.CANVAS = document.getElementsByTagName('canvas')[0];
    }

    nemesis.GL = nemesis.CANVAS.getContext("experimental-webgl", {antialias: true});

    if(nemesis.config().fullscreeen) {
        nemesis.CANVAS.width = window.innerWidth;
        nemesis.CANVAS.height = window.innerHeight;
    }

    nemesis.LOGGER.log('nemesis started.');
}

export = nemesis;