define(["require", "exports"], function (require, exports) {
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
         * Registers a new event. An event should be registered before emit for that event is called.
         * @param eventName The name of the event.
         */
        eventObject.prototype.registerEvent = function (eventName) {
            this._events[eventName] = [];
        };
        /**
         * Registers an event handler. When the given event is emitted, the given handler will be called.
         * @param eventName The name of the event.
         * @param handler The function to call when the event is emitted.
         */
        eventObject.prototype.on = function (eventName, handler) {
            this._events[eventName].push(handler);
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
            this._events[eventName].forEach(function (handler) {
                handler(args);
            });
        };
        return eventObject;
    })();
    return eventObject;
});
