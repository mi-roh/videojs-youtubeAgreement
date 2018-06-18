/**
 * Adds a Lib of Functions
 *
 * Created by micharohde on 17.09.17.
 *
 * @version 2018-06-18
 *
 * SDG
 */

/* globals module */



module.exports = function( grunt ) {


    var Helper = {
        mergeRecursive: function (obj1, obj2) {

            var obj = this.addRecursive( {}, obj1 );

            return this.addRecursive( obj, obj2 );

        },
        addRecursive: function( obj1, obj2 ) {
            for (var p in obj2) {
                try {
                    // Property in destination object set; update its value.
                    if ( obj2[p].constructor === Object ) {
                        obj1[p] = Helper.addRecursive(obj1[p], obj2[p]);

                    } else {
                        obj1[p] = obj2[p];

                    }

                } catch(e) {
                    // Property in destination object not set; create it and set its value.
                    obj1[p] = obj2[p];

                }
            }

            return obj1;
        },

        log: function( a ) {
            if ( arguments.length > 1 ) {
                grunt.log.writeln( JSON.stringify( arguments, null, 2 ) );
            } else {
                grunt.log.writeln( JSON.stringify( a, null, 2 ) );
            }
        }
    };

    return Helper;

};
