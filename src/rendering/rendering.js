define(["require", "exports", "_nemesis", "./shaders", "./shaderProgram", "./primitive", "util/logging/consoleLogger", "./renderObject", "./camera"], function(require, exports, nemesis, Shaders, ShaderProgram, Render, Logger, RenderObject, Camera) {
    var rendering;
    (function (rendering) {
        rendering.GL;
        try  {
            rendering.GL = nemesis.canvas().getContext('experimental-webgl', { antialias: true });
        } catch (e) {
            Logger.logError('Error getting webgl context.', e);
        }

        rendering.shaders = new Shaders(rendering.GL);
        rendering.shaderProgram = function () {
            return new ShaderProgram(rendering.GL);
        };
        rendering.render = new Render(rendering.GL);
        rendering.renderObject = function (vertexes, faces, triangles) {
            return new RenderObject(rendering.GL, vertexes, faces, triangles);
        };
        rendering.camera = Camera;
    })(rendering || (rendering = {}));
    
    return rendering;
});
