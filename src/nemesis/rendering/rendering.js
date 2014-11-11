define(["require", "exports", "./glContext", "./shaders", "./primitive", "./renderObject", "./camera"], function(require, exports, gl, Shaders, Render, RenderObject, Camera) {
    var rendering;
    (function (rendering) {
        rendering.GL = gl;
        rendering.shaders = Shaders;
        rendering.render = Render;
        rendering.renderObject = RenderObject;
        rendering.camera = Camera;
    })(rendering || (rendering = {}));
    
    return rendering;
});
