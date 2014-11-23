///require path="../../../lib/lodash/lodash.d.ts"/>
define(["require", "exports", "lodash", "./texture"], function (require, exports, _, texture) {
    var combinedTexture = (function () {
        function combinedTexture(imgs) {
            var _this = this;
            this._textures = [];
            _.forEach(imgs, function (img) {
                _this._textures.push(new texture(img));
            });
        }
        combinedTexture.prototype.loaded = function () {
            return _.all(this._textures, function (texture) {
                return texture.loaded();
            });
        };
        combinedTexture.prototype.activate = function () {
            for (var i = 0; i < this._textures.length; i++) {
                this._textures[i].activate(i);
            }
        };
        return combinedTexture;
    })();
});
