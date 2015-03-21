/**
 * The entry point class. Contains reference to other modules and manages the game loop.
 */
module nemesis {
    /***** EventObject *****/

    /**
     * An object that can emit events.
     */
    export class eventObject {
        /**
         * Default constructor.
         */
        constructor() {
            this._events = {};
        }

        private _events;

        /**
         * Registers an event handler. When the given event is emitted, the given handler will be called.
         * @param eventName The name of the event.
         * @param handler The function to call when the event is emitted.
         * @returns a function to remove the provided handler from the event.
         */
        public on(eventName: string, handler:(...args:any[]) => void): () => void {
            var handlers = this._events[eventName];
            if(!handlers) {
                this._events[eventName] = handlers = [];
            }
            handlers.push(handler);

            return () => {
                var eventIndex = this._events[eventName].indexOf(handler);
                this._events[eventName][eventIndex] = null;
            };
        }

        /**
         * Emits the given event. Only objects that inherite eventObject should call this method.
         * @param eventName The name of the event.
         * @param args The arguments to pass to the event handlers.
         */
        public emit(eventName:string, ...args:any[]):void {
            if(!this._events[eventName]) {
                return;
            }

            this._events[eventName].forEach(handler => {
                handler(args);
            });
        }
    }

    /***** Core *****/

    var _eventObject: eventObject = new eventObject();

    export function init(context?: any):void {
        _eventObject.emit("init", context);
    }

    /**
     * Starts the game.
     * @param context An object that gets passed to each function, each time a frame is rendered.
     */
    export function run(context?: any):void {
        var animateFrame = (time) => {
            _eventObject.emit("update", time, context);

            _eventObject.emit("prerender", time, context);
            _eventObject.emit("render", time, context);
            _eventObject.emit("postrender", time, context);

            window.requestAnimationFrame(animateFrame);
        };
        window.requestAnimationFrame(animateFrame);
    }

    export function quit():void {
        _eventObject.emit("destroy");
    }

    export function on(event: string, callback: (any) => void): () => void {
        return _eventObject.on(event, callback);
    }

    /***** Config *****/

    export interface NemesisConfig {
        /*
         * If true the canvas element will be resized to fill the window and keep the size of the window.
         */
        fullscreen: boolean;

        /*
         * If true, an error will be thrown when WebGL encounters an eror.
         */
        throwOnGLError: boolean;

        /*
         * If true, will log all calls to web gl.
         */
        logGLCalls: boolean;

        /*
         * If true, calls to web gl will be checked for undefined parameters. Any calls with undefined parameters will be logged.
         */
        validateGLArgs: boolean;
    }

    var _config: NemesisConfig = {
        fullscreen: true,
        throwOnGLError: false,
        logGLCalls: false,
        validateGLArgs: false
    };

    export function config(c?: NemesisConfig):NemesisConfig {
        if(!!c) {
            for(var property in c) {
                if(!c.hasOwnProperty(property)) {
                    continue;
                }

                _config[property] = c[property];
            }
        }

        return _config;
    }

    /***** Canvas *****/

    var _canvas;
    /*var _loadPromise = new Promise(function(resolve, reject) {
     nemesis.on("init", function() {
     var canvas = initCanvas();
     _canvas = canvas;
     resolve(canvas);
     });
     });*/

    /**
     * The canvas element on the page.
     * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
     */
    export function canvas() {
        return _canvas;
    }

    /*export function onLoad(callback: (canvas: any) => void): void {
     _loadPromise.then(callback, null);
     }*/

    var initCanvas = () => {
        var elements = document.getElementsByTagName('canvas');

        if(elements.length == 0) {
            //logger.logError('No canvas elements found.');
        } else {
            for(var i = 0; i < elements.length; i++) {
                if(elements[i].hasAttribute('nemesis')) {
                    _canvas = elements[i];
                    break;
                }
            }
            _canvas = _canvas || elements[0];

            //Fullscreen option must be handled here
            if(nemesis.config().fullscreen) {
                _canvas.height = window.innerHeight;
                _canvas.width = window.innerWidth;
            }
        }
    };

    nemesis.on("init", initCanvas);

    /***** Verifier *****/

    /**
     * Provides methods to verify the given parameter.
     */
    export class verifier {
        /**
         * Create a new verifier.
         * @param value The value to verify
         * @param name The parameter name of the value
         */
        constructor(value: any, name: string) {
            this._value = value;
            this._name = name;
        }

        /**
         * The parameter value
         */
        private _value: any;

        /**
         * The name of the parameter
         */
        private _name: string;

        /**
         * Logs an error if the value is not defined
         * @returns {verifier} This
         */
        public isDefined():verifier {
            if(typeof(this._value) == 'undefined') {
                //logger.logError(this._getMsg("Parameter [{name}, {value}] is undefined"));
            }
            return this;
        }

        /**
         * Logs an error if the value is empty
         * @returns {verifier} This
         */
        public isNotEmpty():verifier {
            if(typeof(this._value.length) != 'undefined' && this._value.length == 0) {
                //logger.logError(this._getMsg("Parameter [{name}, {value}] is empty."));
            }
            return this;
        }

        /**
         * Logs an error if the value is greater then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        public isGreaterThan(x: number) {
            if(this._value <= x) {
                // logger.logError(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"));
            }
            return this;
        }

        /**
         * Logs an error if the value is less then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        public isLessThan(x: number) {
            if(this._value >= x) {
                //logger.logError(this._getMsg("Parameter [{name}, {value}] is less than [" + x + "]"));
            }
            return this;
        }

        /**
         * Retrusn the given message with {name} and {value} replaced with _name and _value.
         * @param msg
         * @returns {any}
         * @private
         */
        private _getMsg(msg:string) {
            return msg.replace("{name}", this._name).replace("{value}", this._value);
        }
    }

    /**
     * Exposes the function to create the verifier.
     */
    export module verify {
        /**
         * Creates a new verifier with the given value and name
         * @param value THe value of the parameter
         * @param name The name of the parameter
         * @returns {verifier} The new verifier
         */
        export function that(value: any, name: string): verifier {
            return new verifier(value, name);
        }
    }
}