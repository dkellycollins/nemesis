///<reference path="../../lib/requirejs/require.d.ts" />

require.config({
    paths: {
        nemesis: "../../src",
        text: "../../node_modules/text/text",
        json: "../../lib/requirejs-plugins/json"
    }
});

require([
        'nemesis/_nemesis',
        'nemesis/rendering/camera',
        'nemesis/rendering/primitive',
        'nemesis/rendering/renderObject',
        'nemesis/rendering/shaders',
        'nemesis/rendering/shaderProgram',
        'nemesis/util/logging/consoleLogger',
        'nemesis/util/math/mat4',
        'nemesis/util/math/vec3'],
    (nemesis, camera, render, renderObject, shaders, shaderProgram, logger, mat4, vec3) => {
        nemesis.canvas().height = window.innerHeight;
        nemesis.canvas().width = window.innerWidth;

        /*========================= SHADERS ========================= */
        var cubeShader = new shaderProgram();
        cubeShader.addShader(shaders.colorVertexShader);
        cubeShader.addShader(shaders.colorFragmentShader);
        cubeShader.init();
        cubeShader.enableAttrib("color");
        cubeShader.enableAttrib("position");

        /*========================= THE CUBE ========================= */
        var vertexes = [
            -1, -1, -1, 1, 1, 0,
            1, -1, -1, 1, 1, 0,
            1, 1, -1, 1, 1, 0,
            -1, 1, -1, 1, 1, 0,

            -1, -1, 1, 0, 0, 1,
            1, -1, 1, 0, 0, 1,
            1, 1, 1, 0, 0, 1,
            -1, 1, 1, 0, 0, 1,

            -1, -1, -1, 0, 1, 1,
            -1, 1, -1, 0, 1, 1,
            -1, 1, 1, 0, 1, 1,
            -1, -1, 1, 0, 1, 1,

            1, -1, -1, 1, 0, 0,
            1, 1, -1, 1, 0, 0,
            1, 1, 1, 1, 0, 0,
            1, -1, 1, 1, 0, 0,

            -1, -1, -1, 1, 0, 1,
            -1, -1, 1, 1, 0, 1,
            1, -1, 1, 1, 0, 1,
            1, -1, -1, 1, 0, 1,

            -1, 1, -1, 0, 1, 0,
            -1, 1, 1, 0, 1, 0,
            1, 1, 1, 0, 1, 0,
            1, 1, -1, 0, 1, 0,

        ];
        var faces = [
            0, 1, 2,
            0, 2, 3,

            4, 5, 6,
            4, 6, 7,

            8, 9, 10,
            8, 10, 11,

            12, 13, 14,
            12, 14, 15,

            16, 17, 18,
            16, 18, 19,

            20, 21, 22,
            20, 22, 23

        ];
        var cube = new renderObject(vertexes, faces, 6 * 2 * 3);
        cube.setShader(cubeShader);

        /*========================= MATRIX ========================= */
        var args = {
            old_time: 0,
            projMatrix: mat4.perspective(mat4.create(), 40, nemesis.canvas().width / nemesis.canvas().height, 1, 100),
            moveMatrix: mat4.create(),
            viewMatrix: mat4.create()
        };
        mat4.translate(args.moveMatrix, args.moveMatrix, vec3.fromValues(0, 0, -6));

        /*========================= DRAWING ========================= */
        render.init();
        nemesis.animate((time, a) => {
            var dt = time - a.old_time;
            a.old_time = time;

            mat4.rotateZ(a.moveMatrix, a.moveMatrix, dt * 0.001);
            mat4.rotateY(a.moveMatrix, a.moveMatrix, dt * 0.002);
            mat4.rotateX(a.moveMatrix, a.moveMatrix, dt * 0.003);

            //logger.log(mat4.str(a.moveMatrix));

            render.begin();
            cubeShader.setActive();
            cubeShader.setMatrix("Pmatrix", a.projMatrix);
            cubeShader.setMatrix("Vmatrix", a.viewMatrix);
            cubeShader.setMatrix("Mmatrix", a.moveMatrix);
            cubeShader.setFloatAttrib("position", 3, 4 * (3 + 3), 0);
            cubeShader.setFloatAttrib("color", 3, 4 * (3 + 3), 3 * 4);
            cube.render();
            render.end();
        }, args);
    });


