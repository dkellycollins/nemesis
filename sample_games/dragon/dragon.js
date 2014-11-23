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
        'nemesis', 'lodash', 'json!dragon.json', 'image!dragon.png'],
    function (nemesis, _, dragonData, dragonTexture) {

        function createDragon(scene, camera, texture) {
            var dragon = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
                nemesis.rendering.shaders.textureVertexShader,
                nemesis.rendering.shaders.textureFragmentShader
            ));
            dragon.setVertexes(cubeData.faces);
            dragon.enableAttrib("aVertex", 3, cubeData.vertexes);
            dragon.enableAttrib("aUV", 2, cubeData.uv);
            dragon.setVector3("vColor", [1, 1, 1]);
            dragon.modelMatrix(nemesis.math.mat4.translate(nemesis.math.mat4.create(), nemesis.math.mat4.IDENTITY, nemesis.math.vec3.fromValues(0, 0, -6)));
            dragon.camera(camera);
            dragon.texture(texture);
            scene.push(dragon);
            return dragon;
        }

        /*========================= THE CUBE ========================= */
        var mainCamera = new nemesis.rendering.camera();
        var texture = new nemesis.rendering.texture(dragonTexture);
        var scene = [];
        createDragon(scene, mainCamera, texture);

        /*========================= DRAWING ========================= */
        var args = {
            old_time: 0
        };
        args.mvp = nemesis.math.mat4.create();

        nemesis.registerUpdateCallback(function (time, a) {
            var dt = time - a.old_time;
            a.old_time = time;

            for (var i = 0; i < scene.length; i++) {
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
            _.forEach(scene, function (object) {
                object.render();
            });
        });
        nemesis.run(args);
    });