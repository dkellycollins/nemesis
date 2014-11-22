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
    'nemesis', 'lodash', 'json!cube.json'], function (nemesis, _, cubeData) {
    function getRandomColor() {
        var color = [];
        for(var i = 0; i < 3; i++) {
            color.push(Math.random());
        }
        return color;
    }

    var mod = 0;
    function getRandomPos() {
        var math = nemesis.math;
        var x = 0;
        var y = 0;
        if(mod > 0) {
            switch(mod % 4) {
                case 0: //First quadrant
                    x = Math.random() * -5 - 1;
                    y = Math.random() * 5 + 1;
                    break;
                case 1: //Second quadrant
                    x = Math.random() * 5 + 1;
                    y = Math.random() * 5 + 1;
                    break;
                case 2: //Third quadrant
                    x = Math.random() * -5 - 1;
                    y = Math.random() * -5 - 1;
                    break;
                case 3: //Fourth quadrant
                    x = Math.random() * 5 + 1;
                    y = Math.random() * -5 - 1;
                    break;
            }
        }
        mod++;
        return math.mat4.translate(math.mat4.create(), math.mat4.IDENTITY, math.vec3.fromValues(x, y, -6));;
    }
    
    function createCube(scene, camera) {
        var cube = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
            nemesis.rendering.shaders.baseVertexShader,
            nemesis.rendering.shaders.colorFragmentShader
        ));
        cube.setVertexes(cubeData.faces);
        cube.enableAttrib("aVertex", 3, cubeData.vertexes);
        cube.setVector3("vColor", getRandomColor());
        cube.modelMatrix(getRandomPos());
        cube.camera(camera);
        scene.push(cube);
        return cube;
    }

    /*========================= THE CUBE ========================= */
    var mainCamera = new nemesis.rendering.camera();
    var scene = [];
    var numOfCubes = parseInt(window.location.hash.replace('#', '')) || 1;
    for(var i = 0; i < numOfCubes; i++) {
        createCube(scene, mainCamera);
    }

    /*========================= DRAWING ========================= */
    var args = {
        old_time: 0
    };
    args.mvp = nemesis.math.mat4.create();

    nemesis.registerUpdateCallback(function (time, a) {
        var dt = time - a.old_time;
        a.old_time = time;

        for(var i = 0; i < scene.length; i++) {
            var m = scene[i].modelMatrix();
            switch (i % 3) {
                case 0:
                    nemesis.math.mat4.rotateZ(m, m, dt * 0.001);
                    nemesis.math.mat4.rotateY(m, m, dt * 0.002);
                    nemesis.math.mat4.rotateX(m, m, dt * 0.003);
                    break;
                case 1:
                    nemesis.math.mat4.rotateX(m, m, dt * 0.001);
                    nemesis.math.mat4.rotateZ(m, m, dt * 0.002);
                    nemesis.math.mat4.rotateY(m, m, dt * 0.003);
                    break;
                case 2:
                    nemesis.math.mat4.rotateY(m, m, dt * 0.001);
                    nemesis.math.mat4.rotateX(m, m, dt * 0.002);
                    nemesis.math.mat4.rotateZ(m, m, dt * 0.003);
                    break;
            }
            scene[i].modelMatrix(m);
        }
    });
    nemesis.registerRenderCallback(function (time, a) {
        _.forEach(scene, function(object) {
            object.render();
        });
    });
    nemesis.run(args);
});
