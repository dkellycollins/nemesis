class eventObject {
    constructor() {
        this._events = {};
    }

    private _events;

    public registerEvent(eventName:string) {
        this._events[eventName] = [];
    }

    public on(eventName: string, handler:(args:any) => void):void {
        this._events[eventName].push(handler);
    }

    public emit(eventName:string, args?:any):void {
        this._events[eventName].forEach(handler => {
            handler(args);
        });
    }
}
export = eventObject;