/* globals require, module */

module.exports = function (grunt) {

    // var cl = require( './grunt-log' )( grunt );

    var textDomain = 'gzbg-form-configurator';


    grunt.template.addDelimiters('comment-delimiters', '/*TPLVAR', '*/');

    // Project configuration.
    grunt.config.merge( {
        pkg: grunt.file.readJSON( 'package.json' ),
        meta: {
            banner: '/*! <%= pkg.name %>, <%= pkg.version %> <%= pkg.homepage %>\n' +
            'MIT License (MIT)' +
            'Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            '<%= pkg.author.name %> \<<%= pkg.author.email %>\> */\n',
            changed: '/*\n' +
            ' * FILE GENERATED - use the .tpl Version to Update this File\n' +
            ' */\n\n'
        },

        watch:{
            gruntfile: {
                files: [
                    'grunt*.js',
                    'gruntfile.js',
                    'package.json'
                ],
                tasks: [ 'default' ]
            }

        },

        template: {
            options: {
                data: {
                    banner: '<%= meta.banner%>',
                    pluginBanner: '<%= meta.wordpressPlugin %>',
                    themeBanner: '<%= meta.wordpressTheme %>',
                    version: '<%= pkg.version %>',
                    name: '<%= pkg.name %>',
                    changed: '<%= meta.changed %>',
                    environment: '<%= env.environment %>',
                    textdomain: textDomain,
                },
                delimiters: 'comment-delimiters'
            }

        }

    } );

    // load tasks
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-template' );


    // Default task(s).

    require( './grunt-task-css' )( grunt, {
        path: {
            src: 'src/',
            dist: 'dist/'
        }
    } );
    require( './grunt-task-js' )( grunt, {
        path: {
            src: 'src/',
            dist: 'dist/'
        }
    } );

    grunt.registerTask( 'develop', [ 'JS-develop', 'CSS-develop' ] );
    grunt.registerTask( 'deploy',  [ 'JS-deploy',  'CSS-deploy'  ] );

    // Default Tasks
    grunt.registerTask( 'default', [ 'build' ] );
    grunt.registerTask( 'build',   'deploy' );

    grunt.event.on( 'watch', function( action, filepath, target ) {
        grunt.log.writeln( target + ': ' + filepath + ' has ' + action );
    } );
};
