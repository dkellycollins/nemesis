/**
 * An object that can emit events.
 */
class eventObject {
    /**
     * Default constructor.
     */
    constructor() {
        this._events = {};
    }

    private _events;

    /**
     * Registers a new event. An event should be registered before emit for that event is called.
     * @param eventName The name of the event.
     */
    public registerEvent(eventName:string) {
        this._events[eventName] = [];
    }

    /**
     * Registers an event handler. When the given event is emitted, the given handler will be called.
     * @param eventName The name of the event.
     * @param handler The function to call when the event is emitted.
     */
    public on(eventName: string, handler:(...args:any[]) => void):void {
        this._events[eventName].push(handler);
    }

    /**
     * Emits the given event. Only objects that inherite eventObject should call this method.
     * @param eventName The name of the event.
     * @param args The arguments to pass to the event handlers.
     */
    public emit(eventName:string, ...args:any[]):void {
        this._events[eventName].forEach(handler => {
            handler(args);
        });
    }
}
export = eventObject;