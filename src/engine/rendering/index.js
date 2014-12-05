define(["require", "exports", './glContext', './shaders', './primitive', './renderObject', './staticRenderObject', './camera', './texture', './orthoCamera'], function (require, exports, GL_file, shaders_file, render_file, renderObject_file, staticRenderObject_file, camera_file, texture_file, orthoCamera_file) {
    exports.GL = GL_file; ///ts:export:generated
    exports.shaders = shaders_file; ///ts:export:generated
    exports.render = render_file; ///ts:export:generated
    exports.renderObject = renderObject_file; ///ts:export:generated
    exports.staticRenderObject = staticRenderObject_file; ///ts:export:generated
    exports.camera = camera_file; ///ts:export:generated
    exports.texture = texture_file; ///ts:export:generated
    exports.orthoCamera = orthoCamera_file; ///ts:export:generated
});
