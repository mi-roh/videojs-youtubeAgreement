/**
 * Handles the SASS/CSS-Files of Grunt
 *
 * Created by micharohde on 21.08.17.
 *
 * @version 0.0.2
 * @version 0.0.2 2018-06-18
 *
 * SDG
 */

/* globals require, module */

module.exports = function( grunt, customConfig ) {

    var helper = require( './grunt-lib-helper' )( grunt );
    // var cl = helper.log;

    if ( 'object' !== typeof customConfig ) {
        customConfig = {};
    }

    var key = 'style';
    var keyMain = 'CSS';

    var keyCC = key.charAt(0).toUpperCase() + key.slice(1),

        subTask = 'js' + keyCC,

        defaultConfig = {
            path: {
                src: 'src/sass/',
                dist: 'dist/css/'
            }
        },
        CONFIG, PATH;


    CONFIG = helper.mergeRecursive( defaultConfig, customConfig );

    PATH = CONFIG.path;

    // Load Dependencies
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-autoprefixer' );
    grunt.loadNpmTasks( 'grunt-banner' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // Register Tasks
    grunt.registerTask( 'CSS',         'CSS-deploy' );
    grunt.registerTask(
        'CSS-develop',
        [
            'clean:cssPreBuild',
            'sass:cssUncompressed',
            'usebanner:css',
            'autoprefixer:cssUncompressed'
        ]
    );
    grunt.registerTask(
        'CSS-deploy',
        [
            'clean:cssPreBuild',
            'sass:cssCompressed',
            'usebanner:css',
            'autoprefixer:cssCompressed'
        ]
    );

    // Load Config
    grunt.config.merge( {

        clean: {
            cssPreBuild: {
                src: [
                    PATH.dist + '**/*.css',
                    PATH.dist + '**/*.css.map'
                ]
            }
        },

        autoprefixer: {
            cssUncompressed: {
                options: {
                    remove: false,
                    map: true
                },
                src: [
                    PATH.dist + '**/*.css'
                ]
            },
            cssCompressed: {
                options: {
                    remove: false,
                    map: false
                },
                src: [
                    PATH.dist + '**/*.css'
                ]
            }
        },

        sass: {
            cssUncompressed: {
                options: {
                    sourcemap: 'auto',
                    debugInfo: false
                },
                files: [ {
                    expand: true,
                    cwd:    PATH.src,
                    src:    [
                        '**/*.scss',
                        '!**/*.tpl.scss'
                    ],
                    dest:   PATH.dist,
                    ext:    '.css',
                    extDot: 'last'
                } ]
            },
            cssCompressed: {
                options: {
                    style:     'compressed',
                    sourcemap: 'none',
                    debugInfo: false
                },
                files: [ {
                    expand: true,
                    cwd:    PATH.src,
                    src:    [
                        '**/*.scss',
                        '!editor-style.scss',
                        '!**/*.tpl.scss'
                    ],
                    dest:   PATH.dist,
                    ext:    '.min.css',
                    extDot: 'last'
                } ]
            }
        },

        usebanner: {
            css: {
                options: {
                    position: 'top',
                    banner: '<%= meta.banner %>',
                    linebreak: true
                },
                files: {
                    src: [
                        '**/*.css',
                    ]
                }
            }
        },

        watch: {
            cssTpl: {
                files: [
                    '**/*.tpl.scss'
                ],
                tasks: [ 'CSS' ]
            },
            css: {
                files:[ PATH.src + '**/*.scss' ],
                tasks:[ 'CSS' ]
            }
        }

    } );

};
