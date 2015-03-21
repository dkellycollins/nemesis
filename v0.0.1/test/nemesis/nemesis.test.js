///<reference path="../lib/es6/es6-promise.d.ts" />
///<reference path="../lib/node/node.d.ts" />
/**
 * The entry point class. Contains reference to other modules and manages the game loop.
 */
var nemesis;
(function (nemesis) {
    /***** EventObject *****/
    /**
     * An object that can emit events.
     */
    var eventObject = (function () {
        /**
         * Default constructor.
         */
        function eventObject() {
            this._events = {};
        }
        /**
         * Registers an event handler. When the given event is emitted, the given handler will be called.
         * @param eventName The name of the event.
         * @param handler The function to call when the event is emitted.
         * @returns a function to remove the provided handler from the event.
         */
        eventObject.prototype.on = function (eventName, handler) {
            var _this = this;
            var handlers = this._events[eventName];
            if (!handlers) {
                this._events[eventName] = handlers = [];
            }
            handlers.push(handler);
            return function () {
                var eventIndex = _this._events[eventName].indexOf(handler);
                _this._events[eventName][eventIndex] = null;
            };
        };
        /**
         * Emits the given event. Only objects that inherite eventObject should call this method.
         * @param eventName The name of the event.
         * @param args The arguments to pass to the event handlers.
         */
        eventObject.prototype.emit = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this._events[eventName]) {
                return;
            }
            this._events[eventName].forEach(function (handler) {
                if (!handler) {
                    return;
                }
                handler(args);
            });
        };
        return eventObject;
    })();
    nemesis.eventObject = eventObject;
    /***** Core *****/
    var _eventObject = new eventObject();
    function init(context) {
        _eventObject.emit("init", context);
    }
    nemesis.init = init;
    /**
     * Starts the game.
     * @param context An object that gets passed to each function, each time a frame is rendered.
     */
    function run(context) {
        var animateFrame = function (time) {
            _eventObject.emit("update", time, context);
            _eventObject.emit("prerender", time, context);
            _eventObject.emit("render", time, context);
            _eventObject.emit("postrender", time, context);
            window.requestAnimationFrame(animateFrame);
        };
        window.requestAnimationFrame(animateFrame);
    }
    nemesis.run = run;
    function quit() {
        _eventObject.emit("destroy");
    }
    nemesis.quit = quit;
    function on(event, callback) {
        return _eventObject.on(event, callback);
    }
    nemesis.on = on;
    var _config = {
        fullscreen: true,
        throwOnGLError: false,
        logGLCalls: false,
        validateGLArgs: false,
        logLevel: 0
    };
    function config(c) {
        if (!!c) {
            for (var property in c) {
                if (!c.hasOwnProperty(property)) {
                    continue;
                }
                _config[property] = c[property];
            }
        }
        return _config;
    }
    nemesis.config = config;
    /***** Logger *****/
    (function (logLevel) {
        logLevel[logLevel["ALL"] = 0] = "ALL";
        logLevel[logLevel["ERROR"] = 1] = "ERROR";
        logLevel[logLevel["WARN"] = 2] = "WARN";
        logLevel[logLevel["INFO"] = 3] = "INFO";
        logLevel[logLevel["OFF"] = 100] = "OFF";
    })(nemesis.logLevel || (nemesis.logLevel = {}));
    var logLevel = nemesis.logLevel;
    var logger;
    (function (logger) {
        var _writers = [];
        function addWriter(writer) {
            _writers.push(writer);
        }
        logger.addWriter = addWriter;
        function removeWriter(writer) {
            var index = _writers.indexOf(writer);
            if (index >= 0) {
                _writers.splice(index, 1);
            }
        }
        logger.removeWriter = removeWriter;
        /**
         * Generic log function.
         * @param logLevel
         * @param message
         * @param error
         */
        function log(level, message, error) {
            if (level > config().logLevel) {
                return;
            }
            _writers.forEach(function (writer) {
                switch (level) {
                    case 1 /* ERROR */:
                        writer.error(message, error);
                        break;
                    case 2 /* WARN */:
                        writer.warn(message, error);
                        break;
                    case 3 /* INFO */:
                        writer.info(message);
                        break;
                }
            });
        }
        logger.log = log;
        function error(message, error) {
            log(1 /* ERROR */, message, error);
        }
        logger.error = error;
        function warn(message, error) {
            log(2 /* WARN */, message, error);
        }
        logger.warn = warn;
        function info(message) {
            log(3 /* INFO */, message);
        }
        logger.info = info;
    })(logger = nemesis.logger || (nemesis.logger = {}));
    var consoleLogger = (function () {
        function consoleLogger() {
        }
        consoleLogger.prototype.error = function (message, error) {
            console.error(message, error);
        };
        consoleLogger.prototype.warn = function (message, error) {
            console.warn(message, error);
        };
        consoleLogger.prototype.info = function (message) {
            console.info(message);
        };
        return consoleLogger;
    })();
    nemesis.consoleLogger = consoleLogger;
    /***** Canvas *****/
    function initCanvas() {
        var canvas;
        var elements = document.getElementsByTagName('canvas');
        if (elements.length == 0) {
            logger.error('No canvas elements found.', null);
        }
        else {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].hasAttribute('nemesis')) {
                    canvas = elements[i];
                    break;
                }
            }
            canvas = canvas || elements[0];
            //Fullscreen option must be handled here
            if (nemesis.config().fullscreen) {
                canvas.height = window.innerHeight;
                canvas.width = window.innerWidth;
            }
        }
        return canvas;
    }
    var _loadPromise = new Promise(function (resolve, reject) {
        nemesis.on("init", function () {
            var canvas = initCanvas();
            if (!!canvas) {
                resolve(canvas);
            }
            else {
                reject();
            }
        });
    });
    /**
     * The canvas element on the page.
     * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
     */
    function canvas() {
        return _loadPromise;
    }
    nemesis.canvas = canvas;
    /***** Verifier *****/
    /**
     * Provides methods to verify the given parameter.
     */
    var verifier = (function () {
        /**
         * Create a new verifier.
         * @param value The value to verify
         * @param name The parameter name of the value
         */
        function verifier(value, name) {
            this._value = value;
            this._name = name;
        }
        /**
         * Logs an error if the value is not defined
         * @returns {verifier} This
         */
        verifier.prototype.isDefined = function () {
            if (typeof (this._value) == 'undefined') {
                logger.error(this._getMsg("Parameter [{name}, {value}] is undefined"), null);
            }
            return this;
        };
        /**
         * Logs an error if the value is empty
         * @returns {verifier} This
         */
        verifier.prototype.isNotEmpty = function () {
            if (typeof (this._value.length) != 'undefined' && this._value.length == 0) {
                logger.error(this._getMsg("Parameter [{name}, {value}] is empty."), null);
            }
            return this;
        };
        /**
         * Logs an error if the value is greater then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        verifier.prototype.isGreaterThan = function (x) {
            if (this._value <= x) {
                logger.error(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"), null);
            }
            return this;
        };
        /**
         * Logs an error if the value is less then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        verifier.prototype.isLessThan = function (x) {
            if (this._value >= x) {
                logger.error(this._getMsg("Parameter [{name}, {value}] is less than [" + x + "]"), null);
            }
            return this;
        };
        /**
         * Retrusn the given message with {name} and {value} replaced with _name and _value.
         * @param msg
         * @returns {any}
         * @private
         */
        verifier.prototype._getMsg = function (msg) {
            return msg.replace("{name}", this._name).replace("{value}", this._value);
        };
        return verifier;
    })();
    nemesis.verifier = verifier;
    /**
     * Exposes the function to create the verifier.
     */
    var verify;
    (function (verify) {
        /**
         * Creates a new verifier with the given value and name
         * @param value THe value of the parameter
         * @param name The name of the parameter
         * @returns {verifier} The new verifier
         */
        function that(value, name) {
            return new verifier(value, name);
        }
        verify.that = that;
    })(verify = nemesis.verify || (nemesis.verify = {}));
})(nemesis || (nemesis = {}));
///<reference path="../../lib/mocha/mocha.d.ts" />
///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../src/nemesis.ts" />
suite("eventObject", function () {
    test("raise event with no listeners", function () {
        //Arange
        var e = new nemesis.eventObject();
        //Act
        e.emit("testEvent");
        //Assert
    });
    test("raise event with one listener", function (done) {
        var e = new nemesis.eventObject();
        e.on("testEvent", function () {
            done();
        });
        e.emit("testEvent");
    });
    test("raise event with arguments", function (done) {
        var e = new nemesis.eventObject();
        var testValue = 3;
        e.on("testEvent", function (value) {
            assert.equal(testValue, value);
            done();
        });
        e.emit("testEvent", testValue);
    });
    test("raise event when multiple events registered", function (done) {
        var e = new nemesis.eventObject();
        e.on("goodEvent", function () {
            done();
        });
        e.on("badEvent", function () {
            throw "badEvent was called";
        });
        e.emit("goodEvent");
    });
    test("unsubscribe event listener", function (done) {
        var e = new nemesis.eventObject();
        var handler1 = e.on("testEvent", function () {
            throw "removed handler called";
        });
        var handler2 = e.on("testEvent", function () {
            done();
        });
        handler1();
        e.emit("testEvent");
    });
});
