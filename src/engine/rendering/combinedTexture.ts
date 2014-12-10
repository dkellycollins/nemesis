///require path="../../../lib/lodash/lodash.d.ts"/>

import gl = require("./glContext");
import texture = require("./texture");
import verifier = require("../util/debug/verifier")

/**
 * A texture that is made up of multiple textures.
 */
class combinedTexture {
    constructor(imgs: any[]) {
        verifier.that(imgs, "imgs").isNotEmpty();
        verifier.that(imgs.length, "imgs.length").isLessThan(32);

        this._textures = [];
        imgs.forEach((img) => {
            this._textures.push(new texture(img));
        });
    }

    private _textures: texture[];

    public loaded(): boolean {
        this._textures.forEach((texture) => {
            if (!texture.loaded())
                return false;
        });
        return true;
    }

    public activate(): void {
        for(var i = 0; i < this._textures.length; i++) {
            this._textures[i].activate(i);
        }
    }
}