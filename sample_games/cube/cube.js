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
    var cube1 = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.baseVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    ));
    cube1.setVertexes(faces);
    cube1.enableAttrib("aPosition", 3, vertexes);
    var cube2 = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.baseVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    ));
    cube2.setVertexes(faces);
    cube2.enableAttrib("aPosition", 3, vertexes);
    var cube3 = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.baseVertexShader,
        nemesis.rendering.shaders.colorFragmentShader
    ));
    cube3.setVertexes(faces);
    cube3.enableAttrib("aPosition", 3, vertexes);
    
    /*========================= DRAWING ========================= */
    var modelMatrix1 = nemesis.math.mat4.translate(nemesis.math.mat4.create(), nemesis.math.mat4.create(), nemesis.math.vec3.fromValues(0, 0, -6));
    var modelMatrix2 = nemesis.math.mat4.clone(modelMatrix1);
    var modelMatrix3 = nemesis.math.mat4.clone(modelMatrix1);

    var mainCamera = new nemesis.rendering.camera();
    mainCamera.setPerspective(40, nemesis.canvas.width / nemesis.canvas.height, 1, 100);

    var args = {
        old_time: 0
    };
    args.m1 = modelMatrix1;
    args.m2 = modelMatrix2;
    args.m3 = modelMatrix3;
    args.mvp = nemesis.math.mat4.create();

    nemesis.registerUpdateCallback(function (time, a) {
        var dt = time - a.old_time;
        a.old_time = time;

        nemesis.math.mat4.rotateZ(a.m1, a.m1, dt * 0.003);
        nemesis.math.mat4.rotateY(a.m1, a.m1, dt * 0.002);
        nemesis.math.mat4.rotateX(a.m1, a.m1, dt * 0.001);

        nemesis.math.mat4.rotateZ(a.m2, a.m2, dt * 0.002);
        nemesis.math.mat4.rotateY(a.m2, a.m2, dt * 0.004);
        nemesis.math.mat4.rotateX(a.m2, a.m2, dt * 0.006);

        nemesis.math.mat4.rotateZ(a.m3, a.m3, dt * 0.001);
        nemesis.math.mat4.rotateY(a.m3, a.m3, dt * 0.002);
        nemesis.math.mat4.rotateX(a.m3, a.m3, dt * 0.003);
    });
    nemesis.registerRenderCallback(function (time, a) {
        nemesis.math.mat4.copy(a.mvp, mainCamera.getProjection());
        nemesis.math.mat4.multiply(a.mvp, a.mvp, mainCamera.getView());
        cube1.setMatrix4("mvp", nemesis.math.mat4.multiply(nemesis.math.mat4.create(), a.mvp, a.m1));
        cube1.setVector3("uPosition", [0, -3, 0]);
        cube1.setVector3("vColor", [1, 1, 0]);
        cube1.render();
        cube2.setMatrix4("mvp", nemesis.math.mat4.multiply(nemesis.math.mat4.create(), a.mvp, a.m2));
        cube2.setVector3("uPosition", [0, 0, 0]);
        cube2.setVector3("vColor", [1, 0, 1]);
        cube2.render();
        cube3.setMatrix4("mvp", nemesis.math.mat4.multiply(nemesis.math.mat4.create(), a.mvp, a.m3));
        cube3.setVector3("uPosition", [0, 3, 0]);
        cube3.setVector3("vColor", [0, 0, 1]);
        cube3.render();
    });
    nemesis.run(args);
});
