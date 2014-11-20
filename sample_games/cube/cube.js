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
    var vertexes1 = [
        -1, -1, -4, //0
        1, -1, -4,  //1
        1, 1, -4,   //2
        -1, 1, -4,  //3

        -1, -1, -2,  //4
        1, -1, -2,   //5
        1, 1, -2,    //6
        -1, 1, -2,   //7

        -1, -1, -4, //8
        -1, 1, -4,  //9
        -1, 1, -2,   //10
        -1, -1, -2,  //11

        1, -1, -4,  //12
        1, 1, -4,   //13
        1, 1, -2,    //14
        1, -1, -2,   //15

        -1, -1, -4, //16
        -1, -1, -2,  //17
        1, -1, -2,   //18
        1, -1, -4,  //19

        -1, 1, -4,  //20
        -1, 1, -2,   //21
        1, 1, -2,    //22
        1, 1, -4,   //23
    ];
    var vertexes2 = [
        -1, -1, -1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1,

        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,
        -1, 1, 1,

        -1, -1, -1,
        -1, 1, -1,
        -1, 1, 1,
        -1, -1, 1,

        1, -1, -1,
        1, 1, -1,
        1, 1, 1,
        1, -1, 1,

        -1, -1, -1,
        -1, -1, 1,
        1, -1, 1,
        1, -1, -1,

        -1, 1, -1,
        -1, 1, 1,
        1, 1, 1,
        1, 1, -1
    ];
    var colors = [
        1, 1, 0, //0
        1, 1, 0, //1
        1, 1, 0, //2
        1, 1, 0, //3

        0, 0, 1, //4
        0, 0, 1, //5
        0, 0, 1, //6
        0, 0, 1, //7

        0, 1, 1, //8
        0, 1, 1, //9
        0, 1, 1, //10
        0, 1, 1, //11

        1, 0, 0, //12
        1, 0, 0, //13
        1, 0, 0, //14
        1, 0, 0, //15

        1, 0, 1, //16
        1, 0, 1, //17
        1, 0, 1, //18
        1, 0, 1, //19

        0, 1, 0, //20
        0, 1, 0, //21
        0, 1, 0, //22
        0, 1, 0 //23
    ]
    var colors2 = [
        1, 0, 1, //16
        1, 0, 1, //17
        1, 0, 1, //18
        1, 0, 1, //19

        0, 0, 1, //4
        0, 0, 1, //5
        0, 0, 1, //6
        0, 0, 1, //7

        1, 1, 0, //0
        1, 1, 0, //1
        1, 1, 0, //2
        1, 1, 0, //3

        1, 0, 0, //12
        1, 0, 0, //13
        1, 0, 0, //14
        1, 0, 0, //15

        0, 1, 0, //20
        0, 1, 0, //21
        0, 1, 0, //22
        0, 1, 0, //23

        0, 1, 1, //8
        0, 1, 1, //9
        0, 1, 1, //10
        0, 1, 1, //11
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
    var shader1 = nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.colorVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    );
    var shader2 = nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.colorVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    );
    var cube1 = new nemesis.rendering.staticRenderObject(shader1);
    cube1.setVertexes(faces);
    cube1.enableAttrib("position", 3, vertexes1);
    cube1.enableAttrib("color", 3, colors);
    var cube2 = new nemesis.rendering.staticRenderObject(shader2);
    cube2.setVertexes(faces);
    cube2.enableAttrib("position", 3, vertexes2);
    cube2.enableAttrib("color", 3, colors2);

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
        cube1.setActive();
        cube1.setMatrix("Pmatrix", mainCamera.getProjection());
        cube1.setMatrix("Vmatrix", mainCamera.getView());
        cube1.setMatrix("Mmatrix", modelMatrix);
        cube1.render();
        cube2.setActive();
        cube2.setMatrix("Pmatrix", mainCamera.getProjection());
        cube2.setMatrix("Vmatrix", mainCamera.getView());
        cube2.setMatrix("Mmatrix", modelMatrix);
        cube2.render();
    });
    nemesis.run(args);
});
