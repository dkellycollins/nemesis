define(["require", "exports"], function(require, exports) {
    var eventObject = (function () {
        function eventObject() {
            this._events = {};
        }
        eventObject.prototype.registerEvent = function (eventName) {
            this._events[eventName] = [];
        };

        eventObject.prototype.on = function (eventName, handler) {
            this._events[eventName].push(handler);
        };

        eventObject.prototype.emit = function (eventName, args) {
            this._events[eventName].forEach(function (handler) {
                handler(args);
            });
        };
        return eventObject;
    })();
    
    return eventObject;
});
