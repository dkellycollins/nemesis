/**
 * Cube data. Nemesis requires that faces are defined, rather then just repeating points in the vertexes array.
 */
var cubeData = {
    //Each group of three numbers defines a point.
    vertexes: [
        1,-1,-1,  //0
        1,-1,1,   //1
        -1,-1,1,  //2
        -1,-1,-1, //3
        1,1,-1,   //4
        1,1,1,    //5
        -1,1,1,   //6
        -1,1,-1   //7
    ],
    //Each number is an index for the vertexes above. Each group of three numbers defines a triangle to be drawn.
    faces: [
        1,2,3,
        7,6,5,
        0,4,5,
        1,5,6,
        6,7,3,
        0,3,7,
        0,1,3,
        4,7,5,
        1,0,5,
        2,1,6,
        2,6,3,
        4,0,7
    ]
};

/**
 * Essentially our "main" function. This function will not be called until
 * nemesis has been loaded.
 */
require(['nemesis'], function(nemesis) {
    /*** Creating the cube ***/

    //First create a new staticRenderObject with the shaders you want to use.
    var cube = new nemesis.rendering.renderObject(nemesis.rendering.shaders.createProgram(
        nemesis.rendering.shaders.baseVertexShader, //Base vertex shader just calculates the vertex position.
        nemesis.rendering.shaders.colorFragmentShader //Color fragment shader colors the object a single color.
    ));

    //Then set what vertexes to draw and in what order.
    cube.setVertexes(cubeData.faces);

    //Next set the data for your cube. Here we set the vertex data (points) and color the cube red.
    cube.enableAttrib("aVertex", 3, cubeData.vertexes);
    cube.setVector3("vColor", [1, 0, 0]);

    //So that we can see the cube when it is drawn, move it on the z-axis.
    var cubePosition = cube.modelMatrix();
    nemesis.math.mat4.translate(cubePosition, cubePosition, [0, 0, -15]);
    cube.modelMatrix(cubePosition);

    //Finally create a camera that will render the cube.
    var camera = new nemesis.rendering.camera();
    cube.camera(camera); //Associate this camera with our cube.

    /** Update and Render ***/

    //Register an update callback, for now just rotate the cube.
    var oldTime = 0;
    nemesis.on("update", function(args) {
        var time = args[0]; //The first argument passed into the update event is time.
        var deltaTime = time - oldTime;
        oldTime = time;

        var cubeRotation = cube.modelMatrix();
        nemesis.math.mat4.rotateZ(cubeRotation, cubeRotation, deltaTime * 0.001);
        nemesis.math.mat4.rotateY(cubeRotation, cubeRotation, deltaTime * 0.002);
        nemesis.math.mat4.rotateX(cubeRotation, cubeRotation, deltaTime * 0.003);
        cube.modelMatrix(cubeRotation);
    });

    //Register a render callback.
    nemesis.on("render", function() {
       cube.render();
    });

    //Run the game!
    nemesis.run();
});