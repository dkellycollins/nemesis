module nemesis {

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
}