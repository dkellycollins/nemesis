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
        nemesis.canvas.width = window.innerWidth;
        nemesis.canvas.height = window.innerHeight;

        function createDragon(scene, camera, texture) {
            /*var dragon = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
             nemesis.rendering.shaders.textureVertexShader,
             nemesis.rendering.shaders.textureFragmentShader
             ));*/
            var dragon = new nemesis.rendering.staticRenderObject(nemesis.rendering.shaders.createProgram(
                nemesis.rendering.shaders.baseVertexShader,
                nemesis.rendering.shaders.colorFragmentShader
            ));
            dragon.setVertexes(dragonData.faces);
            dragon.enableAttrib("aVertex", 3, dragonData.vertexes);
            //dragon.enableAttrib("aUV", 2, cubeData.uv);
            dragon.setVector3("vColor", [1, 0, 0]);
            dragon.modelMatrix(nemesis.math.mat4.translate(nemesis.math.mat4.create(), nemesis.math.mat4.IDENTITY, nemesis.math.vec3.fromValues(0, 0, -25)));
            dragon.camera(camera);
            //dragon.texture(texture);
            scene.push(dragon);
            return dragon;
        }

        /*========================= THE CUBE ========================= */
        var mainCamera = new nemesis.rendering.camera();
        mainCamera.fov(45);
        var texture = new nemesis.rendering.texture(dragonTexture);
        var scene = [];
        createDragon(scene, mainCamera, texture);

        /*========================= DRAWING ========================= */
        var args = {
            drag: false,
            old_x: 0,
            old_y: 0,
            theta: 0,
            phi: 0,
            amortization: 0.95
        };
        args.mvp = nemesis.math.mat4.create();
        args.offset = nemesis.math.vec3.fromValues(0, 0, -25);

        nemesis.registerUpdateCallback(function (time,a) {
            var dx = 0, dy = 0;
            if(nemesis.input.mouse.getButton(nemesis.input.mouseButtons.LEFT) && !a.drag) {
                a.drag=true;
                a.old_x = nemesis.input.mouse.posX;
                a.old_y = nemesis.input.mouse.posY;
            } else if(!nemesis.input.mouse.getButton(nemesis.input.mouseButtons.LEFT)) {
                a.drag = false;
            } else if(a.drag) {
                dx = (nemesis.input.mouse.posX - a.old_x) * 2 * Math.PI / nemesis.canvas.height;
                dy = (nemesis.input.mouse.posY - a.old_y) * 2 * Math.PI / nemesis.canvas.width;
                a.theta += dx;
                a.phi += dy;
                a.old_x = nemesis.input.mouse.posX;
                a.old_y = nemesis.input.mouse.posY;
                console.log(nemesis.input.mouse.posX + ", " + nemesis.input.mouse.posY  );
            }

            dx *= a.amortization;
            dy *= a.amortization;
            a.theta += dx;
            a.phi += dy;

            for(var i = 0;i < scene.length; i++)
            {
                var m = scene[i].modelMatrix();
                nemesis.math.mat4.identity(m);
                nemesis.math.mat4.translate(m, nemesis.math.mat4.IDENTITY, args.offset);
                nemesis.math.mat4.rotateX(m, m, a.theta);
                nemesis.math.mat4.rotateY(m, m, a.phi);
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