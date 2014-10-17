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

        //Setup shader program
        var shaderProgram = new nemesis.rendering.shaderProgram();
        shaderProgram.addShader(nemesis.rendering.shaders.colorVertexShader);
        shaderProgram.addShader(nemesis.rendering.shaders.colorFragmentShader);
        shaderProgram.init();
        shaderProgram.enableAttrib("color");
        shaderProgram.enableAttrib("position");
        shaderProgram.setActive();

        //Setup buffers
        nemesis.rendering.render.createArrayBuffer(vertexes);
        nemesis.rendering.render.createElementArrayBuffer(faces);

        var PROJMATRIX= nemesis.matrix.getProjection(40, CANVAS.width/CANVAS.height, 1, 100);

        //Draw!
        nemesis.animate(function() {
            shaderProgram.
            shaderProgram.setFloat("position", 3, 4*(3+3),0);
            shaderProgram.setFloat("color", 3, 4*(3+3),3*4);
            nemesis.rendering.render.drawTriangles(3);
        });
});
