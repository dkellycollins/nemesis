define(["require", "exports", "./glContext", "./shaders", "./shaderProgram", "./primitive", "./renderObject", "./camera"], function(require, exports, gl, Shaders, ShaderProgram, Render, RenderObject, Camera) {
    var rendering;
    (function (rendering) {
        rendering.GL = gl;
        rendering.shaders = Shaders;
        rendering.shaderProgram = ShaderProgram;
        rendering.render = Render;
        rendering.renderObject = RenderObject;
        rendering.camera = Camera;
    })(rendering || (rendering = {}));
    
    return rendering;
});
