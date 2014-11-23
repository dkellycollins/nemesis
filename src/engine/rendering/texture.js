define(["require", "exports", './glContext', 'lodash'], function (require, exports, gl, _) {
    var texture = (function () {
        function texture(img) {
            this._img = img;
            this._tex = gl.createTexture();
            if (this.loaded()) {
                this._handleLoadedImage();
            }
            else {
                this._img.onload = this._handleLoadedImage();
            }
        }
        texture.prototype.loaded = function () {
            if (this._img.complete) {
                return true;
            }
            return !!(_.isUndefined(this._img.naturalWidth) || this._img.naturalWidth > 0);
        };
        texture.prototype.activate = function (texNumber) {
            texNumber = _.isUndefined(texNumber) ? gl.TEXTURE0 : texNumber;
            gl.activeTexture(texNumber);
            gl.bindTexture(gl.TEXTURE_2D, this._tex);
        };
        texture.prototype._handleLoadedImage = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(gl.TEXTURE_2D, this._tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        return texture;
    })();
    return texture;
});
