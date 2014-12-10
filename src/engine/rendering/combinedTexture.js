///require path="../../../lib/lodash/lodash.d.ts"/>
define(["require", "exports", "./texture", "../util/debug/verifier"], function (require, exports, texture, verifier) {
    /**
     * A texture that is made up of multiple textures.
     */
    var combinedTexture = (function () {
        function combinedTexture(imgs) {
            var _this = this;
            verifier.that(imgs, "imgs").isNotEmpty();
            verifier.that(imgs.length, "imgs.length").isLessThan(32);
            this._textures = [];
            imgs.forEach(function (img) {
                _this._textures.push(new texture(img));
            });
        }
        combinedTexture.prototype.loaded = function () {
            this._textures.forEach(function (texture) {
                if (!texture.loaded())
                    return false;
            });
            return true;
        };
        combinedTexture.prototype.activate = function () {
            for (var i = 0; i < this._textures.length; i++) {
                this._textures[i].activate(i);
            }
        };
        return combinedTexture;
    })();
});
