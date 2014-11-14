///<reference path="../../lib/requirejs/require.d.ts" />
require.config({
    paths: {
        nemesis: "../../build/nemesis",
        text: "../../node_modules/text/text",
        json: "../../bower_components/requirejs-plugins/src/json",
        image: "../../bower_components/requirejs-plugins/src/image",
        lodash: "../../node_modules/lodash/lodash"
    }
});

require([
    'nemesis'], function (nemesis) {
    /*========================= THE CUBE ========================= */
    var vertexes = [
        -1, -1, -1, //0
        1, -1, -1,  //1
        1, 1, -1,   //2

        -1, -1, -1, //0
        1, 1, -1,   //2
        -1, 1, -1,  //3

        -1, -1, 1,  //4
        1, -1, 1,   //5
        1, 1, 1,    //6

        -1, -1, 1,  //4
        1, 1, 1,    //6
        -1, 1, 1,   //7

        -1, -1, -1, //8
        -1, 1, -1,  //9
        -1, 1, 1,   //10

        -1, -1, -1, //8
        -1, 1, 1,   //10
        -1, -1, 1,  //11

        1, -1, -1,  //12
        1, 1, -1,   //13
        1, 1, 1,    //14

        1, -1, -1,  //12
        1, 1, 1,    //14
        1, -1, 1,   //15

        -1, -1, -1, //16
        -1, -1, 1,  //17
        1, -1, 1,   //18

        -1, -1, -1, //16
        1, -1, 1,   //18
        1, -1, -1,  //19

        -1, 1, -1,  //20
        -1, 1, 1,   //21
        1, 1, 1,    //22

        -1, 1, -1,  //20
        1, 1, 1,    //22
        1, 1, -1,   //23
    ];
    var colors = [
        1, 1, 0, //0
        1, 1, 0, //1
        1, 1, 0, //2

        1, 1, 0, //0
        1, 1, 0, //2
        1, 1, 0, //3

        0, 0, 1, //4
        0, 0, 1, //5
        0, 0, 1, //6

        0, 0, 1, //4
        0, 0, 1, //6
        0, 0, 1, //7

        0, 1, 1, //8
        0, 1, 1, //9
        0, 1, 1, //10

        0, 1, 1, //8
        0, 1, 1, //10
        0, 1, 1, //11

        1, 0, 0, //12
        1, 0, 0, //13
        1, 0, 0, //14

        1, 0, 0, //12
        1, 0, 0, //14
        1, 0, 0, //15

        1, 0, 1, //16
        1, 0, 1, //17
        1, 0, 1, //18

        1, 0, 1, //16
        1, 0, 1, //18
        1, 0, 1, //19

        0, 1, 0, //20
        0, 1, 0, //21
        0, 1, 0, //22

        0, 1, 0, //20
        0, 1, 0, //22
        0, 1, 0 //23
    ]
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
    var shader = nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.colorVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    );
    var cube = new nemesis.rendering.renderObject(vertexes, faces, 6 * 2 * 3, shader);
    cube.init();
    cube.setVertexCount(vertexes.length);
    cube.enableAttrib("position", 3, vertexes);
    cube.enableAttrib("color", 3, colors);

    /*========================= CAMERA ========================= */
    /*var args = {
    old_time: 0,
    projMatrix: mat4.perspective(mat4.create(), 40, canvas.width / canvas.height, 1, 100),
    moveMatrix: mat4.create(),
    viewMatrix: mat4.create()
    };
    mat4.translate(args.moveMatrix, args.moveMatrix, vec3.fromValues(0, 0, -6));
    
    /*========================= DRAWING ========================= */
    var modelMatrix = nemesis.math.mat4.create();
    nemesis.math.mat4.translate(modelMatrix, modelMatrix, nemesis.math.vec3.fromValues(0, 0, -6));
    var mainCamera = new nemesis.rendering.camera();
    mainCamera.setPerspective(40, nemesis.canvas.width / nemesis.canvas.height, 1, 100);

    var args = {
        old_time: 0
    };

    nemesis.rendering.render.init();
    nemesis.registerUpdateCallback(function (time, a) {
        var dt = time - a.old_time;
        a.old_time = time;

        nemesis.math.mat4.rotateZ(modelMatrix, modelMatrix, dt * 0.001);
        nemesis.math.mat4.rotateY(modelMatrix, modelMatrix, dt * 0.002);
        nemesis.math.mat4.rotateX(modelMatrix, modelMatrix, dt * 0.003);
    });
    nemesis.registerRenderCallback(function (time, a) {
        cube.setActive();
        cube.setMatrix("Pmatrix", mainCamera.getProjection());
        cube.setMatrix("Vmatrix", mainCamera.getView());
        cube.setMatrix("Mmatrix", modelMatrix);
        cube.render();
    });
    nemesis.run(args);
});
