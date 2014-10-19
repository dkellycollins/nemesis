require.config({
   paths: {
       lib: "../../node_modules"
   }
});

require(['nemesis'],
    function (nemesis, fragmentShaderSource, vertexShaderSource) {
        var vertexes = [
            -1,-1,-5, //first summit -> bottom left of the viewport
            0,0,1,
            1,-1,-5, //bottom right of the viewport
            1,1,0,
            1,1,-5,  //top right of the viewport
            1,0,0
        ];
        var faces = [0,1,2];
        var triangle = new nemesis.rendering.renderObject(vertexes, faces, 3);

        //Setup shader program
        var shaderProgram = new nemesis.rendering.shaderProgram();
        shaderProgram.addShader(nemesis.rendering.shaders.colorVertexShader);
        shaderProgram.addShader(nemesis.rendering.shaders.colorFragmentShader);
        shaderProgram.init();
        shaderProgram.enableAttrib("color");
        shaderProgram.enableAttrib("position");
        triangle.setShader(shaderProgram);

        //Draw!
        nemesis.animate(function() {
            nemesis.rendering.render.begin();
            shaderProgram.setFloatAttrib("position", 3, 4*(3+3),0);
            shaderProgram.setFloatAttrib("color", 3, 4*(3+3),3*4);
            triangle.render();
            nemesis.rendering.render.end();
        });
});
