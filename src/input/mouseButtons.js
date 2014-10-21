define(["require", "exports"], function(require, exports) {
    var mouseButtons;
    (function (mouseButtons) {
        mouseButtons.Left = 0;
        mouseButtons.Middle = 1;
        mouseButtons.Right = 2;
    })(mouseButtons || (mouseButtons = {}));
    
    return mouseButtons;
});
