define(["require", "exports", './glContext', 'lodash'], function (require, exports, gl, _) {
    var texture = (function () {
        function texture(img) {
            this._glTexture = gl.createTexture();
            this._glTexture.image = img;
            if (this._imgLoaded(img)) {
                this._handleLoadedImage();
            }
            else {
                img.onload = this._handleLoadedImage();
            }
        }
        texture.prototype._imgLoaded = function (img) {
            if (img.complete) {
                return true;
            }
            if (_.isUndefined(img.naturalWidth) || img.naturalWidth > 0) {
                return true;
            }
            return false;
        };
        texture.prototype._handleLoadedImage = function () {
            gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._glTexture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        return texture;
    })();
    return texture;
});
