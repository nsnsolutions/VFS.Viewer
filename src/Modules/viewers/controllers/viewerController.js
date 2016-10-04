(function() {
    'use strict';

    const controllerName = 'viewer';
    const controllerId = 'viewerController';

    angular
        .module('app')
        .controller(controllerId, controller);

    controller.$inject = [
        '$scope',
        '$q',
        'sessionService',
        '$location',
        '$http',
        '$routeParams',
        'SweetAlert',
        '$window', 
        '$timeout'
    ];

    function controller($scope, $q, session, $location, $http, $routeParams, SweetAlert, $window, $timeout) {

        // http://localhost:8080/#/editor/1?templatefile=https:%2F%2Fs3-us-west-2.amazonaws.com%2Fvfs-assets%2FSponsors%2FVelma%2Fhomeside%2FDavesHomesideOHFTemplates.json&useruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003&partneruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003%2Fp
        // http://localhost:8080/#/editor/1?templatefile=https:%2F%2Fs3-us-west-2.amazonaws.com%2Fvfs-assets%2FSponsors%2FVelma%2Fhomeside%2FDavesHomesideOHFTemplates.json&useruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003&partneruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003%2Fp
        var vm = this;

        console.log('In the viewer');


        init();

        function init() {


        }

    }    


})();