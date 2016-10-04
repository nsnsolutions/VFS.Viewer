(function () {

    'use strict';

    var config = {

        sessionService: { 
            storageKey: "vfs.viewer",
            cookieDomain: "viewer.vfs.velma.com"
        },

    };

    config.get = function(name, dflt) {

        /* * *
         * Get a specific configuration entry but fill the default data for any
         * elements not present in the config.
         *
         * Arguments:
         * - name: The name of the node to get.
         * - dflt: an object containing the default values for each entry.
         *
         * Returns:
         * - An object containing the default values overriden by values in
         *   this configuration map.
         * * */

        if (!(name in this)) return dflt;

        var ret = {};

        // Create memberwise clone.
        for (var p in dflt)
            ret[p] = dflt[p];

        // Override defaults with local config data.
        for (var p in this[name])
            ret[p] = this[name][p];

        return ret;
    }

    /** Register configuration **/
    var app = angular.module('app');
    app.constant('@config', config);

})();
