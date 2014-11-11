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
                    baseUrl: "src/nemesis",
                    name: "<%= pkg.name %>",
                    paths: {
                        text: "../node_modules/text/text",
                        json: "../bower_components/requirejs-plugins/src/json",
                        image: "../bower_components/requirejs-plugins/src/image",
                        config: 'empty:',
                        lodash: "../node_modules/lodash"
                    },
                    out: 'build/<%= pkg.name %>.js',
                    optimize: 'none'
                }
            }
        },
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'src',
                options: {
                    module: 'amd',
                    target: 'es5',
                    basePath: 'src',
                    sourceMap: false,
                    declaration: false,
                    references: [
                        'lib/**/ *.d.ts'
                    ]
                }
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-typescript');

    // Default task(s).
    grunt.registerTask('default', ['requirejs']);
    grunt.registerTask('production' ['typescript', 'requirejs', 'uglify']);
};
