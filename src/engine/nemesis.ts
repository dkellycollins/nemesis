import eventObject = require("./eventObject");
import _input = require('./input/index');
import _math = require('./math/index');
import _rendering = require('./rendering/index');
import _canvas = require("./canvas");
import _config = require("./config");

/**
 * The entry point class. Contains reference to other modules and manages the game loop.
 */
class nemesis extends eventObject {
    /**
     * Default constructor.
     */
    constructor() {
        super();

        this.input = _input;
        this.math = _math;
        this.rendering = _rendering;
        this.canvas = _canvas;
        this.config = _config;

        this.registerEvent("update");
        this.registerEvent("render");
    }

    /**
     * The input module. Contains classes to handle user input.
     */
    public input;

    /**
     * The math module. Contains classes to do vector and matrix math.
     */
    public math;

    /**
     * The rendering module. Contains classes to render objects to the screen.
     */
    public rendering;

    /**
     * The canvas element the engine is using.
     */
    public canvas;

    /**
     * The configuration options for the game.
     */
    public config;

    /**
     * Starts the game.
     * @param context An object that gets passed to each function, each time a frame is rendered.
     */
    public run(context?:any):void {
        _rendering.render.init();
        var animateFrame = (time) => {
            this.emit("update", time, context);

            _rendering.render.begin();
            this.emit("render", time, context);
            _rendering.render.end();

            window.requestAnimationFrame(animateFrame);
        };
        window.requestAnimationFrame(animateFrame);
    }
}

var _nemesis = new nemesis();
export = _nemesis;