require.config({
    baseUrl: "scripts/cube2",
    paths: {
        nemesis: "../lib/nemesis",
        text: "../lib/text",
        json: "../lib/json",
        image: "../lib/image",
        lodash: "../lib/lodash"
    }
});

require([
        'nemesis', 'json!cube.json', 'image!scripts/cube2/cube_texture.png', 'image!scripts/cube2/cube_texture_2.png'],
    function (nemesis, cubeData, cubeTexture, cubeTexture2) {
        //Make canvas fullscreen.
        nemesis.canvas.height = window.innerHeight;
        nemesis.canvas.width = window.innerWidth;

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
            return math.mat4.translate(math.mat4.create(), math.mat4.IDENTITY, math.vec3.fromValues(x, y, -15));;
        }

        function createCube(scene, camera, texture) {
            var cube = new nemesis.rendering.renderObject(nemesis.rendering.shaders.createProgram(
                nemesis.rendering.shaders.textureVertexShader,
                nemesis.rendering.shaders.textureFragmentShader
            ));
            cube.setVertexes(cubeData.faces);
            cube.enableAttrib("aVertex", 3, cubeData.vertexes);
            cube.enableAttrib("aUV", 2, cubeData.uv);
            cube.setVector3("vColor", [1, 1, 1]);
            cube.modelMatrix(getRandomPos());
            cube.camera(camera);
            cube.texture(texture);
            scene.push(cube);
            return cube;
        }

        /*========================= THE CUBE ========================= */
        var mainCamera = new nemesis.rendering.camera();
        mainCamera.fov(45);
        var texture1 = new nemesis.rendering.texture(cubeTexture);
        var texture2 = new nemesis.rendering.texture(cubeTexture2);
        var scene = [];
        var numOfCubes = parseInt(window.location.hash.replace('#', '')) || 1;
        for(var i = 0; i < numOfCubes; i++) {
            if(i % 2 == 0) {
                createCube(scene, mainCamera, texture1);
            } else {
                createCube(scene, mainCamera, texture2);
            }
        }

        /*========================= DRAWING ========================= */
        var args = {
            old_time: 0
        };
        args.mvp = nemesis.math.mat4.create();

        nemesis.on("update", function (args) {
            var time = args[0];
            var a = args[1];
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
        nemesis.on("render", function () {
            scene.forEach(function (object) {
                object.render();
            });
        });
        nemesis.run(args);
    });