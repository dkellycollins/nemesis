module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "src/",
                    name: "<%= pkg.name %>",
                    paths: {
                        text: "../node_modules/text/text",
                        json: "../lib/requirejs-plugins/json",
                        config: 'empty:',
                        gl_matrix: "../node_modules/gl-matrix/src/gl-matrix"
                    },
                    out: 'build/<%= pkg.name %>.js',
                    optimize: 'none'
                }
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('default', ['requirejs']);
    grunt.registerTask('production' ['requirejs', 'uglify']);
};
