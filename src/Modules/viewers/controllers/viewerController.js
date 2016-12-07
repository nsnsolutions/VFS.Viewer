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

        var vm = this;

        function trustResource(resource){

            console.log("Resource: " + resource);
            
            return $sce.trustAsResourceUrl(resource);
        }

        PDFViewerApplication.pdfViewer = 'PDF.js';
        
        console.log('In the viewer');
        
        $scope.pdf = {
            src: trustResource($routeParams.pdf)
        };

        init();

        function init() {
        }

      

    }    


})();