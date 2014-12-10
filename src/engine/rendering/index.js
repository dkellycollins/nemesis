define(["require", "exports", './glContext', './shaders', './render', './camera', './texture', './renderObject'], function (require, exports, GL_file, shaders_file, render_file, camera_file, texture_file, renderObject_file) {
    exports.GL = GL_file; ///ts:export:generated
    exports.shaders = shaders_file; ///ts:export:generated
    exports.render = render_file; ///ts:export:generated
    exports.camera = camera_file; ///ts:export:generated
    exports.texture = texture_file; ///ts:export:generated
    exports.renderObject = renderObject_file; ///ts:export:generated
});
