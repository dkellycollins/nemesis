/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

/** @license
 * RequireJS plugin for loading JSON files
 * - depends on Text plugin and it was HEAVILY "inspired" by it as well.
 * Author: Miller Medeiros
 * Version: 0.4.0 (2014/04/10)
 * Released under the MIT license
 */
define('json',['text'], function(text){

    var CACHE_BUST_QUERY_PARAM = 'bust',
        CACHE_BUST_FLAG = '!bust',
        jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function')? JSON.parse : function(val){
            return eval('('+ val +')'); //quick and dirty
        },
        buildMap = {};

    function cacheBust(url){
        url = url.replace(CACHE_BUST_FLAG, '');
        url += (url.indexOf('?') < 0)? '?' : '&';
        return url + CACHE_BUST_QUERY_PARAM +'='+ Math.round(2147483647 * Math.random());
    }

    //API
    return {

        load : function(name, req, onLoad, config) {
            if (( config.isBuild && (config.inlineJSON === false || name.indexOf(CACHE_BUST_QUERY_PARAM +'=') !== -1)) || (req.toUrl(name).indexOf('empty:') === 0)) {
                //avoid inlining cache busted JSON or if inlineJSON:false
                //and don't inline files marked as empty!
                onLoad(null);
            } else {
                text.get(req.toUrl(name), function(data){
                    if (config.isBuild) {
                        buildMap[name] = data;
                        onLoad(data);
                    } else {
                        onLoad(jsonParse(data));
                    }
                },
                    onLoad.error, {
                        accept: 'application/json'
                    }
                );
            }
        },

        normalize : function (name, normalize) {
            // used normalize to avoid caching references to a "cache busted" request
            if (name.indexOf(CACHE_BUST_FLAG) !== -1) {
                name = cacheBust(name);
            }
            // resolve any relative paths
            return normalize(name);
        },

        //write method based on RequireJS official text plugin by James Burke
        //https://github.com/jrburke/requirejs/blob/master/text.js
        write : function(pluginName, moduleName, write){
            if(moduleName in buildMap){
                var content = buildMap[moduleName];
                write('define("'+ pluginName +'!'+ moduleName +'", function(){ return '+ content +';});\n');
            }
        }

    };
});


///<reference path="./nemesisConfig.d.ts" />
define('_nemesis',["require", "exports", "json!config.json"], function(require, exports, config) {
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


define('text!rendering/shader_source/color.vertex',[],function () { return 'attribute vec2 position; //the position of the point\r\nattribute vec3 color; //the color of the point\r\nvarying vec3 vColor;\r\nvoid main(void) { //pre-built function\r\n    gl_Position = vec4(position, 0.,1.); //0. is the z, and 1 is w\r\n    vColor=color;\r\n}';});


define('text!rendering/shader_source/color.fragment',[],function () { return 'precision mediump float;\r\nvarying vec3 vColor;\r\nvoid main(void) {\r\n    gl_FragColor = vec4(vColor, 1.);\r\n}';});

///<reference path="./shaders.d.ts" />
define('rendering/shaders',["require", "exports", "../util/logging/consoleLogger", "text!./shader_source/color.vertex", "text!./shader_source/color.fragment"], function(require, exports, logger, colorVertexShader_source, colorFragmentShader_source) {
    var shaders = (function () {
        function shaders(gl) {
            this._gl = gl;
            this.colorVertexShader = this.compile(colorVertexShader_source, this._gl.VERTEX_SHADER);
            this.colorFragmentShader = this.compile(colorFragmentShader_source, this._gl.FRAGMENT_SHADER);
        }
        shaders.prototype.compile = function (source, type) {
            var shader = this._gl.createShader(type);
            this._gl.shaderSource(shader, source);
            this._gl.compileShader(shader);
            if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
                logger.logError("Error compiling shader:" + this._gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };
        return shaders;
    })();
    
    return shaders;
});

define('rendering/shaderProgram',["require", "exports"], function(require, exports) {
    var shaderProgram = (function () {
        function shaderProgram(gl) {
            this._gl = gl;
            this.Id = this._gl.createProgram();
        }
        shaderProgram.prototype.addShader = function (shader) {
            var _this = this;
            if (shader instanceof Array) {
                shader.forEach(function (s) {
                    _this._gl.attachShader(_this.Id, s);
                });
            } else {
                this._gl.attachShader(this.Id, shader);
            }
        };

        shaderProgram.prototype.init = function () {
            this._gl.linkProgram(this.Id);
        };

        shaderProgram.prototype.setActive = function () {
            this._gl.useProgram(this.Id);
        };

        shaderProgram.prototype.enableAttrib = function (attribName) {
            var attrib = this._gl.getAttribLocation(this.Id, attribName);
            this._gl.enableVertexAttribArray(attrib);
        };

        shaderProgram.prototype.setFloatAttrib = function (attribName, index, stride, value) {
            var attrib = this._gl.getAttribLocation(this.Id, attribName);
            this._gl.vertexAttribPointer(attrib, index, this._gl.FLOAT, false, stride, value);
        };

        shaderProgram.prototype.setMatrix = function (uniName, value) {
            var uniform = this._gl.getUniformLocation(this.Id, uniName);
            this._gl.uniformMatrix4fv(uniform, false, value);
        };
        return shaderProgram;
    })();
    
    return shaderProgram;
});

define('rendering/primitive',["require", "exports"], function(require, exports) {
    var primitive = (function () {
        function primitive(gl) {
            this._gl = gl;

            this._gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this._gl.enable(this._gl.DEPTH_TEST);
            this._gl.depthFunc(this._gl.LEQUAL);
            this._gl.clearDepth(1.0);
        }
        primitive.prototype.begin = function () {
            this._gl.viewport(0.0, 0.0, this._gl.canvas.width, this._gl.canvas.height);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
        };

        primitive.prototype.end = function () {
            this._gl.flush();
        };
        return primitive;
    })();

    
    return primitive;
});

define('rendering/renderObject',["require", "exports"], function(require, exports) {
    var renderObject = (function () {
        function renderObject(gl, vertexes, faces, triangles) {
            this._gl = gl;
            this._triangles = triangles;

            this._vertexBuffer = this._createArrayBuffer(vertexes);
            this._faceBuffer = this._createElementArrayBuffer(faces);
        }
        renderObject.prototype.setShader = function (shader) {
            this._shaderProgram = shader;
        };

        renderObject.prototype.getShader = function () {
            return this._shaderProgram;
        };

        renderObject.prototype.render = function () {
            this._gl.useProgram(this._shaderProgram.Id);
            this._gl.drawElements(this._gl.TRIANGLES, this._triangles, this._gl.UNSIGNED_SHORT, 0);
        };

        renderObject.prototype.clone = function () {
            return null;
        };

        renderObject.prototype.dispose = function () {
            this._gl.deleteBuffer(this._vertexBuffer);
            this._gl.deleteBuffer(this._faceBuffer);
        };

        renderObject.prototype._createArrayBuffer = function (bufferData) {
            return this._createBuffer(new Float32Array(bufferData), this._gl.ARRAY_BUFFER);
        };

        renderObject.prototype._createElementArrayBuffer = function (bufferData) {
            return this._createBuffer(new Uint16Array(bufferData), this._gl.ELEMENT_ARRAY_BUFFER);
        };

        renderObject.prototype._createBuffer = function (bufferData, bufferType) {
            var buffer = this._gl.createBuffer();
            this._gl.bindBuffer(bufferType, buffer);
            this._gl.bufferData(bufferType, bufferData, this._gl.STATIC_DRAW);

            return buffer;
        };
        return renderObject;
    })();
    
    return renderObject;
});

define('rendering/rendering',["require", "exports", "_nemesis", "./shaders", "./shaderProgram", "./primitive", "util/logging/consoleLogger", "./renderObject"], function(require, exports, nemesis, Shaders, ShaderProgram, Render, Logger, RenderObject) {
    var rendering;
    (function (rendering) {
        rendering.GL;
        try  {
            rendering.GL = nemesis.canvas().getContext('experimental-webgl', { antialias: true });
        } catch (e) {
            Logger.logError('Error getting webgl context.', e);
        }

        rendering.shaders = new Shaders(rendering.GL);
        rendering.shaderProgram = function () {
            return new ShaderProgram(rendering.GL);
        };
        rendering.render = new Render(rendering.GL);
        rendering.renderObject = function (vertexes, faces, triangles) {
            return new RenderObject(rendering.GL, vertexes, faces, triangles);
        };
    })(rendering || (rendering = {}));
    
    return rendering;
});

define('util/math/common',["require", "exports"], function(require, exports) {
    var common = (function () {
        function common() {
        }
        common.degToRad = function (angle) {
            return (angle * Math.PI / 180);
        };
        return common;
    })();
    
    return common;
});

define('util/math/matrix',["require", "exports", "./common"], function(require, exports, MathCommon) {
    var matrix = (function () {
        function matrix() {
        }
        matrix.getProjection = function (angle, ratio, zMin, zMax) {
            var tan = Math.tan(MathCommon.degToRad(0.5 * angle));
            var A = (zMax + zMin) / (zMax + zMin);
            var B = (-2 * zMax * zMin) / zMax - zMin;

            return [
                (0.5 / tan), 0, 0, 0,
                0, (0.5 * ratio / tan), 0, 0,
                0, 0, A, -1,
                0, 0, B, 0
            ];
        };
        return matrix;
    })();
    
    return matrix;
});

define('nemesis',["require", "exports", "_nemesis", "rendering/rendering", "util/math/matrix"], function(require, exports, _nemesis, Rendering, Matrix) {
    /* The nemesis module is for static varibles and static initialization. */
    var nemesis;
    (function (nemesis) {
        nemesis.animate = _nemesis.animate;
        nemesis.rendering = Rendering;
        nemesis.matrix = Matrix;

        if (_nemesis.config().fullscreen) {
            _nemesis.canvas().width = window.innerWidth;
            _nemesis.canvas().height = window.innerHeight;
        }
    })(nemesis || (nemesis = {}));
    
    return nemesis;
});

