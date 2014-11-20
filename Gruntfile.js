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
                    baseUrl: "src/engine",
                    name: "<%= pkg.name %>",
                    paths: {
                        text: "../../node_modules/text/text",
                        json: "../../bower_components/requirejs-plugins/src/json",
                        image: "../../bower_components/requirejs-plugins/src/image",
                        nemesisconfig: 'empty:',
                        lodash: "../../node_modules/lodash/lodash"
                    },
                    out: 'build/<%= pkg.name %>.js',
                    optimize: 'none'
                }
            }
        },
        ts: {
            options: {
                target: 'es5',
                module: 'amd',
                sourceMap: false,
                declaration: false,
                removeComments: false
            },
            build: {
                src: ['src/**/*.ts']
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-ts');

    // Default task(s).
    grunt.registerTask('debug', ['ts:build', 'requirejs']);
    grunt.registerTask('release' ['ts:build', 'requirejs', 'uglify']);
    grunt.registerTask('default', ['debug']);

};
