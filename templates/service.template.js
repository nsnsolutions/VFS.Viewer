(function () {
    'use strict';

    const factoryName = "$$NAME$$";
    const factoryId = '$$NAME$$Service';
    const defaultConfig = { };

    angular
        .module('app')
        .factory(factoryId, factory);
    
    factory.$inject = [
        'loggerService',
        '@config'
    ];

    function factory(logger, appConfig) {
        var config = appConfig.get(factoryId, defaultConfig);

        var service = { }

        init();

        return service;

        function init() {
            logger.debug(factoryId + " is ready.", factoryName);
        }
    }

})();
