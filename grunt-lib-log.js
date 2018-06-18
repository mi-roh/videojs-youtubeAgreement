/**
 * Adds an Log to dump Objects and Arrays to the Console
 *
 * Created by micharohde on 21.08.17.
 *
 * @version 0.0.2
 *
 * @deprecated
 *
 * SDG
 */

/* globals module, require */


module.exports = function( grunt ) {

    var log = require( './grunt-lib-helper' )( grunt ).log;

    log( 'deprecated call of grunt-lib-log.js – use log() in grunt-lib-helber.js instead' );

    return log;
};
