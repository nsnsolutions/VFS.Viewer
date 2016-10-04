(function() {
    'use strict';

    const factoryName = "Session";
    const factoryId = 'sessionService';

    angular
        .module('app')
        .factory(factoryId, factory);
    
    factory.$inject = [
        '@config',
        'localStorageService' 
    ];

    function factory(appConfig, storage) {

        var service = {
            config: appConfig,
            viewState: { },
            user: { isAuthenticated: false },
            $save: save,
            $load: load
        };

        init();

        return service;

        function save(node) {
            storage.set(node, service[node]);
        }

        function load(node) {
            service[node] = storage.get(node)
        }

        function init() {

            var keys = storage.keys()
            for(var i in keys) load(keys[i]);

        }
    }
})();
