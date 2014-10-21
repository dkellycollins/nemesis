import canvas = require("../nemesisCanvas");

class mouse {
    constructor() {
        canvas.addEventListener("mousedown", this._mouseDown, false);
        canvas.addEventListener("mouseup", this._mouseUp, false);
        canvas.addEventListener("mouseout", this._mouseLeave, false);
        canvas.addEventListener("mouseenter", this._mouseEnter, false);
        canvas.addEventListener("mousemove", this._mouseMove, false);
    }

    public posX: number;
    public posY: number;

    private _button: number;

    public getButton(b:number):boolean {
        return this._button == b;
    }

    private _mouseDown(e) {
        this._button = e.button;
    }

    private _mouseUp(e) {
        this._button = -1;
    }

    private _mouseLeave(e) {
        this.posX = 0;
        this.posY = 0;
    }

    private _mouseEnter(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
    }

    private _mouseMove(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
    }
}
