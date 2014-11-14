///ts:import=glContext,gl
import gl = require('./glContext'); ///ts:import:generated
import _ = require('lodash')

class texture {
    constructor(img: Image) {
        this._glTexture = gl.createTexture();
        this._glTexture.image = img;
        if(this._imgLoaded(img)) {
            this._handleLoadedImage();
        } else {
            img.onload = this._handleLoadedImage();
        }
    }

    private _imgLoaded(img:Image):boolean {
        if(img.complete) { //IE
            return true;
        }
        if(_.isUndefined(img.naturalWidth) || img.naturalWidth > 0) {
            return true;
        }
        return false;
    }

    private _handleLoadedImage() {
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._glTexture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private _glTexture;
}
export = texture;