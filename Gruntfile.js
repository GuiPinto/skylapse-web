module.exports = function (grunt) {

    'use strict';

    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-sass');

    grunt.initConfig({

        handlebars: {

            compile: {

                options: {
                    amd: ['handlebars', 'handlebars.helpers'],
                    namespace: 'templates',
                    processName: function (path) {
                        return path.match(/([\w]+)\.hbs/)[1];
                    }
                },

                files: {
                    'static/templates/compiled.js': ['static/templates/handlebars/**/*.hbs']
                }

            }

        },

        jasmine: {
            test: {
                options: {
                    specs: 'tests/*.js'
                }
            }
        },

        sass: {

            dist: {

                files: {
                    'static/css/styles.css': 'static/css/styles.scss'
                }

            }

        },

        watch: {

            handlebars: {
                files: ['static/templates/handlebars/**/*.hbs'],
                tasks: ['handlebars']
            },

            sass: {
                files: ['static/css/**/*.scss'],
                tasks: ['sass']
            }

        }

    });

    grunt.registerTask('default', [ 'handlebars', 'sass' ]);
    grunt.registerTask('test', [ 'jasmine' ]);

};
