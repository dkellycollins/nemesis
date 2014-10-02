
export interface NemesisConfig {
    canvasId: string;
    fullScreen: boolean;
}

var _config: NemesisConfig;
export function config(c?: NemesisConfig): NemesisConfig {
    if(!c) {
        _config = c;
    }
    return _config || <NemesisConfig>{};
}

export var GL;
export var CANVAS;

if(!!config().canvasId) {
    CANVAS = document.getElementById(config().canvasId);
} else {
    CANVAS = document.getElementsByTagName('canvas')[0];
}

GL = CANVAS.getContext("experimental-webgl", {antialias: true});