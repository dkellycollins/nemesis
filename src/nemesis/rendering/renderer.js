var nemesis = nemesis || {};
nemesis.rendering = nemesis.rendering || {};

nemesis.rendering.renderer = {
    "init": function (SHADER_PROGRAM) {
        nemesis.GL.enable(nemesis.GL.DEPTH_TEST);
        nemesis.GL.depthFunc(nemesis.GL.LEQUAL);
        nemesis.GL.clearColor(0.0, 0.0, 0.0, 0.0);
        nemesis.GL.clearDepth(1.0);
        this._timeOld = 0;

        this._Pmatrix = nemesis.GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
        this._Vmatrix = nemesis.GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
        this._Mmatrix = nemesis.GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

        this._color = nemesis.GL.getAttribLocation(SHADER_PROGRAM, "color");
        this._position = nemesis.GL.getAttribLocation(SHADER_PROGRAM, "position");

        nemesis.GL.enableVertexAttribArray(this._color);
        nemesis.GL.enableVertexAttribArray(this._position);
    },
    "render": function (time, _this) {
        _this = _this || this;

        var dt = time - this._timeOld;
        nemesis.LIBS.rotateZ(nemesis.rendering.camera.MOVEMATRIX, dt * 0.001);
        nemesis.LIBS.rotateY(nemesis.rendering.camera.MOVEMATRIX, dt * 0.002);
        nemesis.LIBS.rotateX(nemesis.rendering.camera.MOVEMATRIX, dt * 0.003);
        this._timeOld = time;

        nemesis.GL.viewport(0.0, 0.0, nemesis.CANVAS.width, nemesis.CANVAS.height);
        nemesis.GL.clear(nemesis.GL.COLOR_BUFFER_BIT | nemesis.GL.DEPTH_BUFFER_BIT);
        nemesis.GL.uniformMatrix4fv(this._Pmatrix, false, nemesis.rendering.camera.PROJMATRIX);
        nemesis.GL.uniformMatrix4fv(this._Vmatrix, false, nemesis.rendering.camera.VIEWMATRIX);
        nemesis.GL.uniformMatrix4fv(this._Mmatrix, false, nemesis.rendering.camera.MOVEMATRIX);
        nemesis.GL.vertexAttribPointer(this._position, 3, nemesis.GL.FLOAT, false, 4 * (3 + 3), 0);
        nemesis.GL.vertexAttribPointer(this._color, 3, nemesis.GL.FLOAT, false, 4 * (3 + 3), 3 * 4);
        nemesis.GL.bindBuffer(nemesis.GL.ARRAY_BUFFER, nemesis.resources.cube.CUBE_VERTEX);
        nemesis.GL.bindBuffer(nemesis.GL.ELEMENT_ARRAY_BUFFER, nemesis.resources.cube.CUBE_FACES);
        nemesis.GL.drawElements(nemesis.GL.TRIANGLES, 6 * 2 * 3, nemesis.GL.UNSIGNED_SHORT, 0);

        nemesis.GL.flush();

        window.requestAnimationFrame(function (time) {
            this.render(time, _this);
        });
    }
}