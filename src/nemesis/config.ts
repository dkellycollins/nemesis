///<reference path="./nemesisConfig.d.ts" />

module nemesis {
    import canvas = nemesis.canvas;

    var _config: NemesisConfig = <NemesisConfig>{};

    export function config(c?: NemesisConfig):NemesisConfig {
        if(!!c) {
            _config = c;
        }

        return _config;
    }
}