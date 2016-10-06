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
        '$timeout',
        '$sce'
    ];

    function controller($scope, $q, session, $location, $http, $routeParams, SweetAlert, $window, $timeout,$sce) {

        // http://localhost:8080/#/editor/1?templatefile=https:%2F%2Fs3-us-west-2.amazonaws.com%2Fvfs-assets%2FSponsors%2FVelma%2Fhomeside%2FDavesHomesideOHFTemplates.json&useruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003&partneruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003%2Fp
        // http://localhost:8080/#/editor/1?templatefile=https:%2F%2Fs3-us-west-2.amazonaws.com%2Fvfs-assets%2FSponsors%2FVelma%2Fhomeside%2FDavesHomesideOHFTemplates.json&useruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003&partneruri=https:%2F%2Fapi.velma.com%2Fapi%2Fohf%2Fs%2F1003%2Fp
        var vm = this;
        //PDFViewerApplication.pdfViewer = 'PDF.js';
        console.log('In the viewer');
        $scope.pdf = {
            src: $routeParams.pdfSrc
        };


        init();

        function init() {

        }

        //$scope.$watch('scale', function() {
        //});

        $scope.onInit = function() {
        };

        $scope.onPageLoad = function(page) {
        };
        function trustResource(resource){
            console.log("HIT");
            return $sce.trustAsResourceUrl(resource);
        }



    }    


})();