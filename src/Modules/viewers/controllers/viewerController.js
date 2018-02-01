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

        PDFViewerApplication.pdfViewer = 'PDF.js';

        function checkForPDF()
        {
            vm.removeOverlay = false;
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
                    $timeout(function(){vm.removeOverlay = true;}, 500);

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
                    console.log("Loading file...");
                    vm.openPDF = true;
                    var test = document.querySelector("div.totalOverlay");
                    test.className = 'totalOverlay1';
                    trustResource($routeParams.pdf);
                    $timeout(function(){vm.removeOverlay = true;}, 500);
                    var browser = detectIE();
                    console.log(browser);
                    if(browser){
                        $('#print').css('display','none');
                    }
                },
                function (error) {
                    console.log("Error:");
                    console.log(error);
                    setTimeout(checkForPDF, vm.checkingMilliseconds);
                }
            );
        }

        function detectIE(){
                var ua = window.navigator.userAgent;

                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    // IE 10 or older => return version number
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    // IE 11 => return version number
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    // Edge (IE 12+) => return version number
                    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }

                // other browser
                return false;
        }


        init();
     
        function init() {
            checkForPDF();
        }



    }


})();