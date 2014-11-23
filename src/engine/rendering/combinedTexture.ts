///require path="../../../lib/lodash/lodash.d.ts"/>

import gl = require("./glContext");
import _ = require("lodash");
import texture = require("./texture");

class combinedTexture {
    constructor(imgs: any[]) {
        this._textures = [];
        _.forEach(imgs, (img) => {
            this._textures.push(new texture(img));
        });
    }

    private _textures: texture[];

    public loaded(): boolean {
        return _.all(this._textures, (texture) => {
            return texture.loaded();
        });
    }

    public activate(): void {
        for(var i = 0; i < this._textures.length; i++) {
            this._textures[i].activate(i);
        }
    }
}