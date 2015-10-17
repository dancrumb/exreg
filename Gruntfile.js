module.exports = function(grunt) {
    "use strict";
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    var files = ['src/**/*.js', 'tests/**/*.js', 'Gruntfile.js'];
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: "./.jshintrc",
                '-W030': true
            },
            files: {
                src: ['src/**/*.js', 'Gruntfile.js', 'test/**/*.js']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['tests/*.js']
            }
        },
        watch:{
            all:{
                files: files.concat('test/**/*.json'),
                tasks:['test']
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'mochaTest:test']);

};
