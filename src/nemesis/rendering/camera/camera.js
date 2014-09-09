var nemesis = nemesis || {};
nemesis.rendering = nemesis.rendering || {};

nemesis.rendering.camera = {
    "init": function() {
        this.PROJMATRIX=nemesis.LIBS.get_projection(40, nemesis.CANVAS.width/nemesis.CANVAS.height, 1, 100);
        this.MOVEMATRIX=nemesis.LIBS.get_I4();
        this.VIEWMATRIX=nemesis.LIBS.get_I4();
        nemesis.LIBS.translateZ(this.VIEWMATRIX, -6);
    }
}