(function () {
    'use strict';

    const controllerId = 'baseController';

    angular
        .module('app')
        .controller(controllerId, controller);

    controller.$inject = [ 
        '$rootScope',
        'sessionService',
        '$location' 
    ];

    function controller($rootScope, logger, session, $location) {
        var vm = this;
    };

})();
