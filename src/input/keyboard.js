define(["require", "exports", "../canvas"], function(require, exports, canvas) {
    var keyboard;
    (function (keyboard) {
        var _state = {};

        function getKey(keyName) {
            return !!_state[keyName];
        }
        keyboard.getKey = getKey;

        function keyUp(event) {
            _state[event.code] = true;
        }

        function keyDown(event) {
            _state[event.code] = false;
        }

        canvas.addEventListener("keyup", keyUp, false);
        canvas.addEventListener("keydown", keyDown, false);
    })(keyboard || (keyboard = {}));
    
    return keyboard;
});
