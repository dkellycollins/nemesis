require.config({
   paths: {
       lib: "../../node_modules"
   }
});

require(['nemesis'],
    function (nemesis, fragmentShaderSource, vertexShaderSource) {
        var vertexes = [
            -1,-1, //first summit -> bottom left of the viewport
            0,0,1,
            1,-1, //bottom right of the viewport
            1,1,0,
            1,1,  //top right of the viewport
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

        //Draw!
        nemesis.animate(function() {
            shaderProgram.setFloat("position", 2, 4*(2+3),0);
            shaderProgram.setFloat("color", 3, 4*(2+3),2*4);
            nemesis.rendering.render.drawTriangles(3);
        });
});
