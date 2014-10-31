///<reference path="../../lib/requirejs/require.d.ts" />

require.config({
    paths: {
        nemesis: "../../src",
        text: "../../node_modules/text/text",
        json: "../../bower_components/requirejs-plugins/src/json",
        image: "../../bower_components/requirejs-plugins/src/image",
        lodash: "../../node_modules/lodash/lodash"
    }
});

require([
        'nemesis/nemesis',
        'nemesis/canvas',
        'nemesis/rendering/camera',
        'nemesis/rendering/primitive',
        'nemesis/rendering/renderObject',
        'nemesis/rendering/shaders',
        'nemesis/rendering/shaderProgram',
        'nemesis/util/logging/consoleLogger',
        'nemesis/util/math/mat4',
        'nemesis/util/math/vec3',
        'image!cube_texture.jpg'],
    (nemesis, canvas, camera, render, renderObject, shaders, shaderProgram, logger, mat4, vec3) => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

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

        /*========================= SHADERS ========================= */
        var cubeShader = new shaderProgram();
        cubeShader.addShader(shaders.colorVertexShader);
        cubeShader.addShader(shaders.colorFragmentShader);
        cubeShader.init();
        cubeShader.enableAttrib("position", 3, 4 * (3 + 3), 0);
        cubeShader.enableAttrib("color", 3, 4 * (3 + 3), 3 * 4);
        cube.setShader(cubeShader);

        /*========================= CAMERA ========================= */
        /*var args = {
            old_time: 0,
            projMatrix: mat4.perspective(mat4.create(), 40, canvas.width / canvas.height, 1, 100),
            moveMatrix: mat4.create(),
            viewMatrix: mat4.create()
        };
        mat4.translate(args.moveMatrix, args.moveMatrix, vec3.fromValues(0, 0, -6));

        /*========================= DRAWING ========================= */
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -6));
        var mainCamera = new camera();
        mainCamera.setPerspective(40, canvas.width / canvas.height, 1, 100);

        var args = {
            old_time: 0
        };

        render.init();
        nemesis.registerUpdateCallback((time, a) => {
            var dt = time - a.old_time;
            a.old_time = time;

            mat4.rotateZ(modelMatrix, modelMatrix, dt * 0.001);
            mat4.rotateY(modelMatrix, modelMatrix, dt * 0.002);
            mat4.rotateX(modelMatrix, modelMatrix, dt * 0.003);
        });
        nemesis.registerRenderCallback((time, a) => {
            render.begin();
            cubeShader.setActive();
            cubeShader.setMatrix("Pmatrix", mainCamera.getProjection());
            cubeShader.setMatrix("Vmatrix", mainCamera.getView());
            cubeShader.setMatrix("Mmatrix", modelMatrix);
            cube.render();
            render.end();
        });
        nemesis.run(args);
    });


