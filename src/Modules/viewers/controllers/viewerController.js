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

        // Metadata
        vm.checkingMilliseconds = 3000;
        vm.checks = 5;
        vm.counter = 0;
        $scope.pdf = null;

        function trustResource(resource){

            console.log("Resource: " + resource);
            $scope.pdf = {
                src: $sce.trustAsResourceUrl($routeParams.pdf)
            };

        }

        //
        //$scope.pdf = {
        //    src: trustResource($routeParams.pdf)
        //};

        //function trustResource(resource){
        //    console.log("Resource: " + resource);
        //
        //    if(i != 3) {
        //        $http({
        //            method: 'GET',
        //            url: $routeParams.pdf
        //        }).then(
        //            function (data) {
        //                vm.opened = true;
        //                console.log("HERE I AM!!!!!!");
        //                console.log(data);
        //                //$interpolate($scope.pdf)($scope);
        //                return $sce.trustAsResourceUrl($routeParams.pdf);
        //            },
        //            function (error) {
        //                console.log("FAILED DAMMIT");
        //                console.log(error);
        //                i++;
        //                $timeout(function(){
        //                    trustResource($routeParams.pdf);
        //                }, 5000)
        //            }
        //        )
        //    }
        //
        //    else{
        //        console.log("TOO MANY FAILURES!");
        //    }
        //
        //    //
        //    //if(resource || i == 10) {
        //    //    return $sce.trustAsResourceUrl(resource);
        //    //}
        //    //else{
        //    //    i++;
        //    //    trustResource($routeParams.pdf);
        //    //}
        //}


        PDFViewerApplication.pdfViewer = 'PDF.js';

        console.log('In the viewer');

        function checkForPDF()
        {
            if (vm.counter >= vm.checks) {
                console.log("Exceeded Checks - No More checky checky");
                return;
            }

            vm.counter++;

            console.log("Check for PDF");

            $http({
                method: 'GET',
                url: $routeParams.pdf
            }).then(
                function (data) {
                    console.log("Success -- Load it");
                    trustResource($routeParams.pdf);
                },
                function (error) {
                    console.log("FAILED DAMMIT");
                    setTimeout(checkForPDF, vm.checkingMilliseconds);
                }
            );
        }


        init();
        //
        //function checkForItem() {
        //
        //    console.log("Check for Item");
        //
        //}

        function init() {

            checkForPDF();

        }



    }


})();