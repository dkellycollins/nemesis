define(["require", "exports", "_nemesis", "./shaders", "./primitive", "util/logging/consoleLogger"], function(require, exports, nemesis, Shaders, Render, Logger) {
    var rendering;
    (function (rendering) {
        debugger;

        try  {
            rendering.GL = nemesis.canvas().getContext('experimental-webgl', { antialias: true });
        } catch (e) {
            Logger.logError('Error getting webgl context.', e);
        }

        rendering.GL;
        rendering.shaders = new Shaders(rendering.GL);
        rendering.render = new Render(rendering.GL);
    })(rendering || (rendering = {}));

    
    return rendering;
});
//# sourceMappingURL=rendering.js.map
