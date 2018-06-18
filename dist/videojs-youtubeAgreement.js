/**
 * VideoJS Plugin with User Agreement for Youtube Videos
 *
 * Created by Micha Rohde on 11.06.18.
 *
 * @licence MIT
 *
 * SDG
 */

/* globals require, window, document */

'use strict';

( function( require, window, document ) {

    /**
     * LOAD DEPENDENCIES
     */
    var

        /**
         * @type {jquery}
         */
        $ = require( 'jquery' ),

        /**
         * @type {videojs}
         */
        videojs = require( 'videojs.js' );

    /**
     * SET CONSTANTS
     */
    var
        /**
         * Name of the Plugin
         * @type {string}
         */
        PLUGIN_NAME = 'youtubeAgreement',

        /**
         * Name of the internal Plugin for Rebuild
         * @type {string}
         */
        PLUGIN_NAME_REBUILD = '_' + PLUGIN_NAME + 'Rebuild',

        /**
         * Lifetime of the Agreement in Days
         * @type {number}
         */
        COOKIE_LIFETIME = 7,

        /**
         * Name of the Agreement Cookie
         * @type {string}
         */
        COOKIE_NAME = 'youtubeAgreement',

        /**
         * Value of the Agreement Cookie
         * @type {string}
         */
        COOKIE_VALUE = 'true',

        /**
         * videoJS root-element class if YouTube is enabled
         * @type {string}
         */
        CLASS_NAME_ENABLED = 'vjs-plugin-has-' + PLUGIN_NAME,

        /**
         * videoJS root-element class if YouTube is disabled
         * @type {string}
         */
        CLASS_NAME_DISABLED = 'vjs-plugin-no-' + PLUGIN_NAME,

        /**
         * Options Plugin Attribute Name
         * @type {string}
         */
        PLUGINS = 'plugins',

        /**
         * VideoJS Options Attribute Name
         * @type {string}
         */
        OPTIONS = 'options',

        PRIVACY_POLICY_URL = 'privacyPolicyUrl',

        /**
         * Default values for Global Options
         * @type {{
         *      textInfo: string,
         *      textButton: string,
         *      textPrivacy: string,
         *      textPrivacyLink: string,
         *      textDisagree: string,
         *      textReload: string,
         *      privacyPolicyUrl: boolean
         * }}
         */
        GLOBAL_OPTIONS_DEFAULT = {
            textInfo: 'Yes, I want to view content from YouTube.',
            textButton: 'Show now',
            textPrivacy: 'You can find further information in our {1}.',
            textPrivacyLink: 'privacy police',
            textDisagree: 'I don\'t want to see YouTube content any more.',
            textReload: 'YouTube will be removed completely after reload or with loading the next page.',
            privacyPolicyUrl: false
        },

        /**
         * Global Options
         * Set by Global Initialization
         * @type {{
         *      textInfo: string,
         *      textButton: string,
         *      textPrivacy: string,
         *      textPrivacyLink: string,
         *      textDisagree: string,
         *      textReload: string,
         *      privacyPolicyUrl: boolean
         * }}
         */
        GLOBAL_OPTIONS = {};

    /**
     * DEFINE GLOBAL VARIABLES
     */
    var
        /**
         * If the videoJS Youtube Plugin is loaded
         * @type {boolean}
         */
        libLoaded = false;

    /**
     * HELPER
     */

    /**
     * Loads the videoJS Youtube Plugin
     * @return {boolean}
     */
    function loadVideoJsYoutubeLib() {

        if ( !libLoaded ) {

            require( 'videojs-youtube' );
            libLoaded = true;

            return true;

        }

        return false;
    }

    /**
     * Generates an multidimensional Object or extends an existing Object with missing attributes
     * @param object {{}} Existing Object
     * @param keys {[string]|string} name of attributes. Each key represents a depth
     * @return {{}}
     */
    function deepObject( object, keys ) {

        if ( !( keys instanceof Array ) ) {
            keys = [ keys ];
        }

        var key = keys.shift();

        if ( !object.hasOwnProperty( key ) ) {
            object[ key ] = {};
        }

        if ( keys.length > 0 ) {
            object[ key ] = deepObject( object[ key ], keys );
        }

        return object;

    }

    /**
     * Set a Cookie
     * @param name {string} Name of the Cookie
     * @param value {string} Value of the Cookie
     * @param days {number} Lifetime of the Cookie
     * @copyright https://www.quirksmode.org/js/cookies.html
     */
    function cookieCreate( name, value, days ) {

        var expires = '';

        if ( days ) {
            var date = new Date();
            date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
            expires = '; expires=' + date.toGMTString();
        }

        document.cookie = name + '=' + value + expires + '; path=/';
    }

    /**
     * Get a Cookie
     * @param name {string} Name of the Cookie
     * @copyright https://www.quirksmode.org/js/cookies.html
     */
    function cookieRead( name ) {

        var nameEQ = name + '=',
            ca = document.cookie.split( ';' );

        for ( var i = 0; i < ca.length; i++ ) {

            var c = ca[ i ];

            while ( c.charAt( 0 ) === ' ' ) {
                c = c.substring( 1, c.length );
            }

            if ( c.indexOf( nameEQ ) === 0 ) {
                return c.substring( nameEQ.length, c.length );
            }
        }

        return null;
    }

    /**
     * Delete a Cookie
     * @param name {string} Name of the Cookie
     * @copyright https://www.quirksmode.org/js/cookies.html
     */
    function cookieErase( name ) {

        cookieCreate( name, '', -1 );
    }

    /**
     * Sets the Cookie Status to Agreed – if it isn't set jet
     */
    function agree() {

        if ( !agreed() ) {
            cookieCreate( COOKIE_NAME, COOKIE_VALUE, COOKIE_LIFETIME );
        }
    }

    /**
     * Sets the Cookie Status to Disagreed / removes the cookie
     */
    function disagree() {

        cookieErase( COOKIE_NAME );
    }

    /**
     * Returns if Cookie Status in boolean
     * @return {boolean}
     */
    function agreed() {

        return cookieRead( COOKIE_NAME ) === COOKIE_VALUE;
    }

    /**
     * GLOBAL INITIALIZATION
     */

    /**
     * Init Global Options
     */
    deepObject( videojs, [ OPTIONS, PLUGIN_NAME ] );

    GLOBAL_OPTIONS = videojs[ OPTIONS ][ PLUGIN_NAME ];
    for ( var o in GLOBAL_OPTIONS_DEFAULT ) {
        if ( !GLOBAL_OPTIONS.hasOwnProperty( o ) ) {
            GLOBAL_OPTIONS[ o ] = GLOBAL_OPTIONS_DEFAULT[ o ];
        }
    }

    /**
     * PLUGIN
     */

    /**
     *
     * @param videoEl {HTMLElement} the Root Element
     * @param videoOptions {{}} the options passed to videojs
     * @constructor
     */
    var YoutubeAgreement = function( videoEl, videoOptions ) {

        // Store Parameter
        this._$videoEl = $( videoEl );

        this._$originalEl = this._$videoEl.clone();

        this._$domEl = false;

        this._videoOptions = videoOptions;

        this._options = {};

        this._sourcesBackup = [];

        this._isYoutube = false;

        this._displayAgreed = false;

        this._$layer = false;

        /**
         * @type {Player}
         * @private
         */
        this._playerInstance = false;

        this._init();
    };

    YoutubeAgreement.prototype = {

        /**
         * Returns the Options for the beforeSetup Hook
         * @return {*}
         */
        getBeforeSetupOptions: function() {

            if ( !this._isYoutube ) {
                delete this._videoOptions[ PLUGINS ][ PLUGIN_NAME ];
            }

            return this._videoOptions;
        },

        /**
         * Sets the Instance of the Player
         * @param playerInstance {Player}
         */
        setPlayerInstance: function( playerInstance ) {
            this._playerInstance = playerInstance;
        },

        /**
         * Sets the Dom of the Player
         * @param $dom
         */
        setDOM: function( $dom ) {
            this._$domEl = $dom;
            $dom.data( PLUGIN_NAME, this );
        },

        /**
         * set current Plugin Call Options
         * @param options {{}} Options to pass
         */
        setOptions: function( options ) {
            this._options = options;
        },

        /**
         * Apply Messages depending on the agreement-status to the video
         */
        buildMessage: function() {

            var _this = this;

            if ( agreed() ) {

                _this._buildDisagreeMessage();

            } else {

                _this._buildAgreeMessage();

            }
        },

        /**
         * Agree to view YouTube
         */
        agree: function() {

            var _this = this;

            // Set Cookie
            agree();

            // Load Lib
            if ( loadVideoJsYoutubeLib() ) {

                // Update Video after a moment to give videojs-youtube the chance to load the youtube-api

                this._buildDisable();

                window.setTimeout( function() {

                    _this._rebuildAll();

                }, 1000 );

            } else {

                // Update Video
                _this._rebuildAll();

            }
        },

        /**
         * Disagree to view YouTube
         */
        disagree: function() {

            disagree();

            // Update Video
            this._rebuildAll();

        },

        /**
         * Rebuild the video-player and load create new instance of videojs
         * @return {boolean}
         */
        rebuild: function() {

            var _this = this,
                options = _this._videoOptions,
                $newEl;

            if ( _this._displayAgreed !== agreed() ) {
                return false;
            }

            // Set Original Sources
            options.sources = _this._sourcesBackup;

            // Clone Element
            $newEl = _this._$originalEl.insertAfter( _this._$domEl );

            // Remove old Player
            _this._playerInstance.dispose();

            // Init new Player-Instance
            videojs( $newEl[ 0 ], options );
        },

        /**
         * Logic of the Class running on Initialization
         * @private
         */
        _init: function() {

            var _this = this,
                isYoutube = false,
                options = _this._videoOptions,
                disabled = !agreed(),
                originalSources = options.sources || {},
                backupSources = _this._sourcesBackup;

            // Set Plugin Config
            deepObject( options, [ PLUGINS, PLUGIN_NAME ] );

            // Load Sources as Array
            if ( !( originalSources instanceof Array ) ) {
                originalSources = [ originalSources ];
            }
            options.sources = originalSources;

            // Check for Youtube && Backup Sources
            for ( var i in originalSources ) {

                backupSources.push( originalSources[ i ] );

                if ( _this._isYoutubeSource( originalSources[ i ] ) ) {

                    isYoutube = true;

                    if ( disabled ) {
                        originalSources.splice( i, 1 );
                    }

                }
            }
            _this._isYoutube = isYoutube;

            // set Reference
            _this._$videoEl.data( PLUGIN_NAME, _this );

        },

        /**
         * Build the Text asking for Agreement
         * @private
         */
        _buildAgreeMessage: function() {

            var _this = this,
                privacyLink,
                $messageBox = $( '<div></div>' ),
                textInfo, textButton, textPrivacyLink, textPrivacy, textReload;

            if ( _this._options.hasOwnProperty( PRIVACY_POLICY_URL ) ) {
                privacyLink = _this._options[ PRIVACY_POLICY_URL ];
            } else {
                privacyLink = GLOBAL_OPTIONS[ PRIVACY_POLICY_URL ];
            }

            _this._displayAgreed = true;

            // Load Texts
            textInfo = _this._localize( 'Info' );
            textButton = _this._localize( 'Button' );
            textPrivacyLink = _this._localize( 'PrivacyLink' );
            if ( privacyLink ) {
                textPrivacyLink = '<a href="' + privacyLink + '" target="_blank">' + textPrivacyLink + '</a>';
            }
            textPrivacy = _this._localize( 'Privacy', [ textPrivacyLink ] );
            textReload = _this._localize( 'Reload' );

            // Build Message Box
            $( '<span class="agreementText">' + textInfo  + '</span>' )
                .appendTo( $messageBox );
            $( '<button class="agreement" title="' + textButton + '">' + textButton + '</button>' )
                .appendTo( $messageBox )
                .on( 'click', function( e ) {

                    _this.agree();

                    e.preventDefault();

                } );
            $( '<span class="privacyText">' + textPrivacy + '</span>' )
                .appendTo( $messageBox );

            if ( libLoaded ) {
                $( '<span class="reloadText">' + textReload + '</span>' )
                    .appendTo( $messageBox );
            }

            // Build Plugin Layer
            _this._agreementLayer( $messageBox );

            // Set Classes
            _this._$domEl
                .removeClass( CLASS_NAME_ENABLED )
                .addClass( CLASS_NAME_DISABLED );
        },

        /**
         * Build the Text to Disagree
         * @private
         */
        _buildDisagreeMessage: function() {

            var _this = this,
                textDisagree = _this._localize( 'Disagree' ),
                $button = $( '<button title="' + textDisagree + '">' + textDisagree + '</button>' );

            _this._displayAgreed = false;

            // Init Button
            $button
                .on( 'click', function( e ) {

                    _this.disagree();

                    e.preventDefault();

                } );

            // Build Plugin Layer
            _this._agreementLayer( $button );

            // Set Classes
            _this._$domEl
                .removeClass( CLASS_NAME_DISABLED )
                .addClass( CLASS_NAME_ENABLED );
        },

        /**
         * Set some classes during Agreement
         * @private
         */
        _buildDisable: function() {

            var _this = this;

            // Build Plugin Layer
            _this._agreementLayer();

            // Set Classes
            _this._$domEl
                .removeClass( CLASS_NAME_ENABLED )
                .addClass( CLASS_NAME_DISABLED );

        },

        _agreementLayer: function( $content ) {

            var _this = this;

            if ( !_this._$layer ) {
                _this._$layer = $( '<div class="vjs-plugin-' + PLUGIN_NAME + '">' )
                    .appendTo( _this._$domEl );
            }

            _this._$layer
                .html( '' );

            if ( $content ) {
                _this._$layer
                    .append( $content );
            }
        },

        /**
         * Trigger Rebuild for all videojs-instances on the page
         * @private
         */
        _rebuildAll: function() {

            var players = videojs.getPlayers(),
                p;

            for ( p in players ) {
                players[ p ][ PLUGIN_NAME_REBUILD ]();
            }

        },

        /**
         * Handels the Localization of Texts in this Plugin
         * @param key {string} the Key of the Text to Display
         * @param [tokens] {Array} a List of Tokenx to replace in the Text
         * @return {string}
         * @private
         */
        _localize: function( key, tokens ) {

            var _this = this,
                optKey = 'text' + key;

            if ( _this._options.hasOwnProperty( optKey ) ) {
                return _this._options[ optKey ];
            }

            return _this._playerInstance.localize( PLUGIN_NAME + key, tokens, GLOBAL_OPTIONS[ optKey ] );
        },

        /**
         * Checks if a given Source is a youtube-source declaration
         * @param sourceConfig
         * @return {boolean}
         * @private
         */
        _isYoutubeSource: function( sourceConfig ) {

            sourceConfig = sourceConfig || {};
            sourceConfig.type = sourceConfig.type || '';

            return sourceConfig.type === 'video/youtube';

        }
    };

    /**
     * VIDEOJS PLUGINS AND HOOKS
     */

    /**
     * Hook beforesetup
     * Detect if the Video is a Youtube-Agreement. Initialize the Plugin
     * @param videoEl
     * @param options
     * @return {*}
     */
    videojs.hook( 'beforesetup', function( videoEl, options ) {
        deepObject( options, [ PLUGINS, PLUGIN_NAME ] );

        var YA = new YoutubeAgreement( videoEl, options );

        return YA.getBeforeSetupOptions();

    } );

    /**
     * Plugin
     * Build the Youtube Agreement
     * @param pluginOptions {{}} Parameter passed by the Initialization
     */
    videojs.registerPlugin( PLUGIN_NAME, function( options ) {

        var /**
             *
             * @type {Player|*}
             */
            player = this,

            $player = $( player.el() ),

            /**
             * @type {YoutubeAgreement}
             */
            YA = $player.data( PLUGIN_NAME ) || $player.find( 'video' ).data( PLUGIN_NAME ) || false;

        if ( !YA ) {
            return;
        }

        YA.setPlayerInstance( player );
        YA.setDOM( $player );
        YA.setOptions( options );

        player.ready( function() {

            YA.buildMessage();

        } );

    } );

    /**
     * Plugin
     * internal Plugin to reload the Video
     */
    videojs.registerPlugin( PLUGIN_NAME_REBUILD, function() {

        /**
         * @type {Player|*}
         */
        var player = this,

            $player = $( player.el() ),
            /**
             * @type {YoutubeAgreement}
             */
            YA = $player.data( PLUGIN_NAME ) || $player.find( 'video' ).data( PLUGIN_NAME ) || false;

        if ( !YA ) {
            return;

        }

        YA.rebuild();

    } );

    // Enable Youtube On Load if Enabled previously
    if ( agreed() ) {
        loadVideoJsYoutubeLib();
    }

} ( require, window, document ) );
