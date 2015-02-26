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
                    baseUrl: "build/src/engine",
                    name: "nemesis",
                    paths: {
                        text: "../../../node_modules/text/text"
                    },
                    out: 'build/nemesis.js',
                    optimize: 'none'
                }
            },
            importer: {
                options: {
                    baseUrl: "build/src/importer",
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
                src: ['src/**/*.ts'],
                outDir: 'build/src'
            },
            test: {
                options: {
                    module: 'commonjs'
                },
                src: ['test/**/*.ts'],
                outDir: 'build/test'
            }
        },
        mochaTest: {
            options: {
                ui: 'tdd'
            },
            test: {
                options: {
                    reporter: 'progress'
                },
                src: ['build/test/**/*.js']
            }
        },
        copy: {
            shaders: {
                src: "src/engine/nemesis.shaders/*.glsl",
                dest: "build/"
            }
        },
        clean: ['build']
    });

    // Load the pluengins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('build', ['clean', 'ts:build', 'copy:shaders', 'requirejs:engine']);
    grunt.registerTask('release', ['build', 'uglify']);
    grunt.registerTask('test', ['ts:test', 'mochaTest']);
    grunt.registerTask('default', ['build', 'test']);

};
