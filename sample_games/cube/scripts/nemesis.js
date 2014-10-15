///<reference path="./nemesisConfig.d.ts" />
define('_nemesis',["require", "exports"], function(require, exports) {
    
    var config = require('json!config.json');

    /* The nemesis class defines methods and varible that are used by those methods. */
    var _nemesis = (function () {
        function _nemesis() {
        }
        _nemesis.config = function (c) {
            if (!!c) {
                this._config = c;
            }
            return this._config || config;
        };

        _nemesis.canvas = function () {
            if (!this._canvas) {
                if (this.config().canvasId) {
                    this._canvas = document.getElementById(this.config().canvasId);
                } else {
                    this._canvas = document.getElementsByTagName('canvas')[0];
                }
            }
            return this._canvas;
        };

        _nemesis.animate = function (animateFunc, args) {
            var _this = this;
            this._animate = function (args) {
                animateFunc(args);
                window.requestAnimationFrame(function () {
                    _this._animate(args);
                });
            }; //TODO will this cause a memory leak?
            this._animate(args);
        };
        return _nemesis;
    })();
    
    return _nemesis;
});
//# sourceMappingURL=_nemesis.js.map
;
define('util/logging/consoleLogger',["require", "exports"], function(require, exports) {
    var consoleLogger = (function () {
        function consoleLogger() {
        }
        consoleLogger.log = function (msg) {
            console.log(msg);
        };

        consoleLogger.logError = function (msg, e) {
            console.error(msg);
            if (!!e) {
                console.error(e.toString());
            }
        };
        return consoleLogger;
    })();

    
    return consoleLogger;
});
//# sourceMappingURL=consoleLogger.js.map
;
define('rendering/shaders',["require", "exports", "../util/logging/consoleLogger"], function(require, exports, logger) {
    var shaders = (function () {
        function shaders(_gl) {
            this._gl = _gl;
        }
        shaders.prototype.createProgram = function () {
            return this._gl.createProgram();
        };

        shaders.prototype.compile = function (source, type, program) {
            var shader = this._gl.createShader(type);
            this._gl.shaderSource(shader, source);
            this._gl.compileShader(shader);
            if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
                logger.logError("Error compiling shader:" + this._gl.getShaderInfoLog(shader));
                return null;
            }

            if (!!program) {
                this._gl.attachShader(program, shader);
            }
            return shader;
        };

        shaders.prototype.linkProgram = function (program) {
            this._gl.linkProgram(program);
        };

        shaders.prototype.setFloat = function (program, attribName, index, stride, pointer) {
            var attrib = this._gl.getAttributeLocation(program, attribName);
            this._gl.vertexAttribPointer(attrib, index, this._gl.FLOAT, false, stride, pointer);
        };
        return shaders;
    })();
    
    return shaders;
});
//# sourceMappingURL=shaders.js.map
;
define('rendering/primitive',["require", "exports"], function(require, exports) {
    var primitive = (function () {
        function primitive(_gl) {
            this._gl = _gl;
        }
        primitive.prototype.drawTriangles = function (numOfPoints) {
            this._gl.viewport(0.0, 0.0, this._gl.canvas.width, this._gl.canvas.height);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT);
            this._gl.drawElements(this._gl.TRIANGLES, numOfPoints, this._gl.UNSIGNED_SHORT, 0);
            this._gl.flush();
        };

        primitive.prototype.createArrayBuffer = function (bufferData) {
            return this.createBuffer(new Float32Array(bufferData), this._gl.ARRAY_BUFFER);
        };

        primitive.prototype.createElementArrayBuffer = function (bufferData) {
            return this.createBuffer(new Uint16Array(bufferData), this._gl.ELEMENT_ARRAY_BUFFER);
        };

        primitive.prototype.createBuffer = function (bufferData, bufferType) {
            var buffer = this._gl.createBuffer();
            this._gl.bindBuffer(bufferType, buffer);
            this._gl.bufferData(bufferType, bufferData, this._gl.STATIC_DRAW);

            return buffer;
        };

        primitive.prototype.deleteBuffer = function (buffer) {
            this._gl.deleteBuffer(buffer);
        };
        return primitive;
    })();

    
    return primitive;
});
//# sourceMappingURL=primitive.js.map
;
define('rendering/rendering',["require", "exports", "../_nemesis", "./shaders", "./primitive", "../util/logging/consoleLogger"], function(require, exports, nemesis, Shaders, Render, Logger) {
    var rendering;
    (function (rendering) {
        debugger;

        try  {
            rendering.GL = nemesis.canvas().getContext('experimental-webgl', { antialias: true });
        } catch (e) {
            Logger.logError('Error getting webgl context.', e);
        }

        rendering.GL;
        rendering.shaders = new Shaders(rendering.GL);
        rendering.render = new Render(rendering.GL);
    })(rendering || (rendering = {}));

    
    return rendering;
});
//# sourceMappingURL=rendering.js.map
;
define('nemesis',["require", "exports", "_nemesis", 'rendering/rendering'], function(require, exports, _nemesis, Rendering) {
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.animate;
        nemesis.rendering;

        if (_nemesis.config().fullscreeen) {
            _nemesis.canvas().width = window.innerWidth;
            _nemesis.canvas().height = window.innerHeight;
        }

        nemesis.animate = _nemesis.animate;
        nemesis.rendering = Rendering;
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});
//# sourceMappingURL=nemesis.js.map
;
