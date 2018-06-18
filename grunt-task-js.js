/**
 * Handles the JS-Files of Grunt
 *
 * Created by micharohde on 21.08.17.
 *
 * @version 0.0.4-18.10. / 11.01.18
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

    var key = 'script';
    var keyMain = 'JS';

    var keyCC = key.charAt(0).toUpperCase() + key.slice(1),

        subTask = 'js' + keyCC,

        defaultConfig = {
            path: {
                src: 'src/js/',
                dist: 'dist/js/'
            }
        },
        CONFIG, PATH;

    CONFIG = helper.mergeRecursive( defaultConfig, customConfig );

    // cl( CONFIG );

    PATH = CONFIG.path;

    // Load Dependencies
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-jscs' );

    // Register Tasks
    grunt.registerTask( keyMain, keyMain + '-deploy' );
    grunt.registerTask( keyMain + '-develop', [
        'clean:' + subTask + '_preBuild',
        'copy:' + subTask
    ] );
    grunt.registerTask( keyMain + '-deploy', [
        keyMain + '-develop',
        'uglify:' + subTask
    ] );

    grunt.registerTask( keyMain + '-lint', [
        'jshint:' + subTask,
        'jscs:' + subTask
    ] );

    // Load Config
    var gruntConfig = {
        path: {},
        clean: {},
        copy: {},
        uglify: {},
        usebanner: {},
        jshint: {},
        jscs: {},
        watch: {}
    };

    gruntConfig.path[ subTask ] = PATH;

    gruntConfig.clean[ subTask + '_preBuild' ] = {
        src: [
            PATH.dist + '**/*.js'
        ]
    };
    // gruntConfig.clean[ subTask + '_deploy' ] = {
    //     src: [
    //         PATH.dist + '**/*.js',
    //         '!' + PATH.dist + '**/*.min.js'
    //     ]
    // };

    gruntConfig.copy[ subTask ] = {
        expand: true,
        cwd: PATH.src,
        src: [
            '**/*.js'
        ],
        dest: PATH.dist,
        filter: 'isFile',
    };

    gruntConfig.uglify[ subTask ] = {
        options: {
            banner: '<%=meta.banner%>',
            sourceMap: false,
            mangle: {}
        },
        files: [ {
            expand: true,
            cwd:    PATH.dist,
            src:    [
                '**/*.js',
                '!**/*.min.js'
            ],
            dest:   PATH.dist,
            ext:    '.min.js',
            extDot: 'last'
        } ]
    };

    /**
     * @todo Optimize Selector or only Add One per path
     */
    gruntConfig.jshint[ subTask ] = {
        options: {
            jshintrc: '.jshintrc'
        },
        files: {
            src: [

                // './grunt*.js',
                PATH.src + '**/*.js',
                '!' + PATH.src + 'ext/**/*.js'
            ]
        }
    };

    /**
     * @todo Optimize Selector or only Add One per path
     */
    gruntConfig.jscs[ subTask ] = {
        options: {
            config: '.jscsrc'
        },
        src: [

            // './grunt*.js',
            PATH.src + '**/*.js',
            '!' + PATH.src + 'ext/**/*.js'
        ]
    };

    gruntConfig.watch[ subTask ] = {
        files:[ PATH.src + '**/*.js' ],
        tasks:[ keyMain ]
    };

    grunt.config.merge( gruntConfig );

};
