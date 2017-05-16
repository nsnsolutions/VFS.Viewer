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
        vm.openPDF = false;
        vm.failed = false;
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
                vm.failed = true;
                var test = document.querySelector("div.totalOverlay");
                test.className = 'totalOverlay1';
                swal({
                    title: "Oops! File not found.",
                    text: 'Click retry to look again or cancel to quit',
                    //type: "warning",
                    showCancelButton: true,
                    //confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Retry",
                    closeOnConfirm: true
                }, function() {
                    vm.failed = false;
                    vm.counter = 0;
                    var test = document.querySelector("div.totalOverlay1");
                    test.className = 'totalOverlay';
                    checkForPDF();
                });
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
                    vm.openPDF = true;
                    var test = document.querySelector("div.totalOverlay");
                    test.className = 'totalOverlay1';
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