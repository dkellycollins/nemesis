define(["require", "exports", 'util/logger'], function(require, exports, Logger) {
    var config = require('json!config.json');

    var nemesis = (function () {
        function nemesis() {
        }
        nemesis.config = function (c) {
            if (!!c) {
                this._config = c;
            }
            return this._config || {};
        };
        return nemesis;
    })();

    var nemesis;
    (function (nemesis) {
        //Set config.
        nemesis.config(config);

        //Setup logger.
        nemesis.LOGGER = new Logger();

        if (!!nemesis.config().canvasId) {
            nemesis.CANVAS = document.getElementById(nemesis.config().canvasId);
        } else {
            nemesis.CANVAS = document.getElementsByTagName('canvas')[0];
        }

        nemesis.GL = nemesis.CANVAS.getContext("experimental-webgl", { antialias: true });

        if (nemesis.config().fullscreeen) {
            nemesis.CANVAS.width = window.innerWidth;
            nemesis.CANVAS.height = window.innerHeight;
        }

        nemesis.LOGGER.log('nemesis started.');
    })(nemesis || (nemesis = {}));

    
    return nemesis;
});
//# sourceMappingURL=nemesis.js.map
