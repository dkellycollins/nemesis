module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/nemesis.js',
                dest: 'build/nemesis.min.js'
            }
        },
        requirejs: {
            engine: {
                options: {
                    baseUrl: "src/engine",
                    name: "nemesis",
                    paths: {
                        text: "../../node_modules/text/text"
                    },
                    out: 'build/nemesis.js',
                    optimize: 'none'
                }
            },
            importer: {
                options: {
                    baseUrl: "src/importer",
                    name: "main",
                    out: 'build/importer.js',
                    optimize: 'none'
                }
            }
        },
        ts: {
            options: {
                target: 'es5',
                sourceMap: false,
                declaration: false,
                removeComments: false
            },
            build: {
                options: {
                    module: 'amd'
                },
                src: ['src/**/*.ts']
            },
            test: {
                options: {
                    module: 'commonjs'
                },
                src: ['test/**/*.ts']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'progress'
                },
                src: ['test/**/*.js']
            },
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-mocha-test')

    // Default task(s).
    grunt.registerTask('debug', ['ts:build', 'requirejs:engine']);
    grunt.registerTask('release', ['ts:build', 'requirejs:engine', 'uglify']);
    grunt.registerTask('test', ['ts:test', 'mochaTest']);
    grunt.registerTask('default', ['debug', 'test']);

};
