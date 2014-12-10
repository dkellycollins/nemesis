import gl = require('./glContext');
import verify = require('../util/debug/verifier');

/**
 * Manages a texture on the graphics card.
 */
class texture {
    /**
     * Creates a new texture with the given image.
     * @param img The image to send to the graphics card
     */
    constructor(img: any) {
        this._img = img;
        this._tex = gl.createTexture();
        if(this.loaded()) {
            this._handleLoadedImage();
        } else {
            this._img.onload = this._handleLoadedImage();
        }
    }

    /**
     * The handle to the texture on the graphics card
     */
    private _tex: WebGLTexture;

    /**
     * The image that was loaded on the client
     */
    private _img: any;

    /**
     * Gets if the texture has been loaded on the graphics card
     * @returns {boolean} True if the texture has been sent to the graphics card. False, otherwise.
     */
    public loaded():boolean {
        if(this._img.complete) { //IE
            return true;
        }
        return !!(typeof(this._img.naturalWidth) == 'undefined' || this._img.naturalWidth > 0);
    }

    /**
     * Sets this texture as active on graphics card.
     * @param texNumber The texture number on the graphics card
     */
    public activate(texNumber?: number):void {
        texNumber = typeof(texNumber) == 'undefined' ? gl.TEXTURE0 : texNumber;

        verify.that(texNumber, "texNumber").isGreaterThan(-1).isLessThan(32);

        gl.activeTexture(texNumber);
        gl.bindTexture(gl.TEXTURE_2D, this._tex);
    }

    /**
     * Sends the image
     * @private
     */
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