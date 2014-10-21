///<reference path="./nemesisConfig.d.ts" />

import config = require("json!config.json");

/* The nemesis class defines methods and varible that are used by those methods. */
class _nemesis {
    private static _config: NemesisConfig;
    public static config(c?: NemesisConfig): NemesisConfig {
        if (!!c) {
            this._config = c;
        }
        return this._config || <NemesisConfig>config;
    }

    public static _canvas: HTMLCanvasElement;
    public static canvas(): HTMLCanvasElement {
        if(!this._canvas) {
            if(this.config().canvasId) {
                this._canvas = <HTMLCanvasElement>document.getElementById(this.config().canvasId);
            } else {
                this._canvas = document.getElementsByTagName('canvas')[0];
            }
        }
        return this._canvas;
    }

    public static _animate: (time: any, args:any) => void;
    public static animate(animateFunc: (time: any, args:any) => void, args?: any) {
        this._animate = (time, args: any) => {
            animateFunc(time, args);
            window.requestAnimationFrame((t) => {this._animate(t, args)});
        };
        window.requestAnimationFrame((t) => {this._animate(t, args)});
    }
}
export = _nemesis;