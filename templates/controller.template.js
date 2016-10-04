(function() {
    'use strict';

    const controllerName = '$$NAME$$';
    const controllerId = '$$NAME$$Controller';

    angular
        .module('app')
        .controller(controllerId, controller);

    controller.$inject = [
        '$scope',
        'loggerService',
        'sessionService'
    ];

    function controller($scope, logger, session) {

        var vm = this;

        vm.title = "$$TITLE$$";

        activate();

        /*** --- ***/

        function activate() {
            logger.debug(controllerId + " is ready.", controllerName);
        }
    }

})();
