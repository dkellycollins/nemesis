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
        nemesis.rendering.shaders.baseVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    );
    var cube1 = new nemesis.rendering.staticRenderObject(shader1);
    cube1.setVertexes(faces);
    cube1.enableAttrib("position", 3, vertexes1);
    cube1.setVector3("vColor", [1, 1, 0]);
    var cube2 = new nemesis.rendering.staticRenderObject(shader1);
    cube2.setVertexes(faces);
    cube2.enableAttrib("position", 3, vertexes2);
    cube2.setVector3("vColor", [1, 0, 1]);
    
    /*========================= DRAWING ========================= */
    var modelMatrix = nemesis.math.mat4.create();
    nemesis.math.mat4.translate(modelMatrix, modelMatrix, nemesis.math.vec3.fromValues(0, 0, -6));
    var mainCamera = new nemesis.rendering.camera();
    mainCamera.setPerspective(40, nemesis.canvas.width / nemesis.canvas.height, 1, 100);

    var args = {
        old_time: 0
    };

    window.resize(function() {
       mainCamera.setPerspective(40, nemesis.canvas.width / nemesis.canvas.height, 1, 100);
    });
    nemesis.registerUpdateCallback(function (time, a) {
        var dt = time - a.old_time;
        a.old_time = time;

        nemesis.math.mat4.rotateZ(modelMatrix, modelMatrix, dt * 0.001);
        nemesis.math.mat4.rotateY(modelMatrix, modelMatrix, dt * 0.002);
        nemesis.math.mat4.rotateX(modelMatrix, modelMatrix, dt * 0.003);
    });
    nemesis.registerRenderCallback(function (time, a) {
        var mvp = nemesis.math.mat4.clone(mainCamera.getProjection());
        nemesis.math.mat4.multiply(mvp, mvp, mainCamera.getView());
        nemesis.math.mat4.multiply(mvp, mvp, modelMatrix);
        cube1.setMatrix4("mvp", mvp);
        cube1.render();
        cube2.setMatrix4("mvp", mvp);
        cube2.render();
    });
    nemesis.run(args);
});
