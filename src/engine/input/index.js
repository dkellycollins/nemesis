define(["require", "exports", './keyboard', './mouse', './mouseButtons'], function (require, exports, keyboard_file, mouse_file, mouseButtons_file) {
    exports.keyboard = keyboard_file; ///ts:export:generated
    exports.mouse = mouse_file; ///ts:export:generated
    exports.mouseButtons = mouseButtons_file; ///ts:export:generated
});
