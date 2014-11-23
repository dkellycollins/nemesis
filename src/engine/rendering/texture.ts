import gl = require('./glContext');
import _ = require('lodash');

class texture {
    constructor(img: any) {
        this._img = img;
        this._tex = gl.createTexture();
        if(this.loaded()) {
            this._handleLoadedImage();
        } else {
            this._img.onload = this._handleLoadedImage();
        }
    }

    private _tex: WebGLTexture;
    private _img: any;

    public loaded():boolean {
        if(this._img.complete) { //IE
            return true;
        }
        return !!(_.isUndefined(this._img.naturalWidth) || this._img.naturalWidth > 0);
    }

    public activate(texNumber?: number):void {
        texNumber = _.isUndefined(texNumber) ? gl.TEXTURE0 : texNumber;
        gl.activeTexture(texNumber);
        gl.bindTexture(gl.TEXTURE_2D, this._tex);
    }

    private _handleLoadedImage():void {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.bindTexture(gl.TEXTURE_2D, this._tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
export = texture;