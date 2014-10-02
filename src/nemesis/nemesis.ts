///<amd-dependency path="json!config.json" />

declare var require:(moduleId:string) => any;
var config: nemesis.Config = require('json!config.json');

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
}

module nemesis {
    export interface Config {
        canvasId: string;
        fullscreeen: boolean;
    }

    debugger;
    nemesis.config(config);

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
}

export = nemesis;