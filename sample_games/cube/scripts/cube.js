require.config({
   paths: {
       lib: "../../node_modules"
   }
});

require(['nemesis',
    'text!shaders/triangle_fragment_shader.fs',
    'text!shaders/triangle_vertex_shader.vs'],
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
        var shaderProgram = nemesis.rendering.shaders.createProgram();
        nemesis.rendering.shaders.compileFragementShader(fragmentShaderSource, shaderProgram);
        nemesis.rendering.shaders.compileVertexShader(vertexShaderSource, shaderProgram);
        nemesis.rendering.shaders.linkProgram(shaderProgram);
        nemesis.rendering.shaders.setActiveProgram(shaderProgram);

        //Setup buffers
        nemesis.rendering.render.createArrayBuffer(vertexes);
        nemesis.rendering.render.createElementArrayBuffer(faces);

        //Draw!
        nemesis.animate(function() {
            nemesis.rendering.shaders.setFloat(shaderProgram, "color", 4*(2+3),0);
            nemesis.rendering.shaders.setFloat(shaderProgram, "position", 4*(2+3),2*4)
            nemesis.rendering.render.drawTriangles(3);
        });
});
