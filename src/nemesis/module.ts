/**
 * The entry point class. Contains reference to other modules and manages the game loop.
 */
module nemesis {
    import eventObject = nemesis.eventObject;

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
}
