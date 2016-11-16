(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular Modules
        'ngRoute',
        // Angular-Local-Storage: HTML5 storage, cookies for older browsers.
        'LocalStorageModule', 
        // Sweet Alert
        'oitozero.ngSweetAlert',
        'pdfjsViewer'
    ]);
  
    /* 
     * Global App Configuration 
     */

    app.config([
    
        'localStorageServiceProvider',
        '$routeProvider',
        '@config',
        '$locationProvider',
     
        function(localStorageServiceProvider, $routeProvider, config, $locationProvider) {

            localStorageServiceProvider.setPrefix(config.sessionService.storageKey);
            localStorageServiceProvider.setStorageCookieDomain(config.sessionService.cookieDomain);

            $routeProvider
                .when('/?pdf=:pdfSrc*', {
                    templateUrl: "Modules/viewers/templates/pdfViewer.html"
                })

                .otherwise({
                    redirectTo: '/'
                });

                $locationProvider.html5Mode(true);

            //http://localhost:8282/#/viewer/1pdf=xxx  
            //http://localhost:8282/#/pdf=https://vfs-job.s3.amazonaws.com/Velma/live/VP20161114211515d294544e/VP20161114211515d294544e.pdf
            //  
        }

    ]);


    /* 
     * This cache interceptor is used to make sure the http get calls are pulling new version of files
     * that potentially changed through a get request. 
     */

  
    app.config([
            '$httpProvider', 

            function($httpProvider) {

                $httpProvider.interceptors.push('noCacheInterceptor');

            }]).factory('noCacheInterceptor', function () {
            
                 //initialize get if not there
   
            return {
                
                request: function (config) {

                    // console.log(config.method);
                    // console.log(config.url);
                    if(config.method=='GET'){
                         var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                         config.url = config.url+separator+'noCache=' + new Date().getTime();
                    }

                    return config;
               }
           };
    });


    angular.module('oitozero.ngSweetAlert', [])
    .factory('SweetAlert', [ '$rootScope', function ( $rootScope ) {

        var swal = window.swal;

        //public methods
        var self = {

            swal: function ( arg1, arg2, arg3 ) {
                $rootScope.$evalAsync(function(){
                    if( typeof(arg2) === 'function' ) {
                        swal( arg1, function(isConfirm){
                            $rootScope.$evalAsync( function(){
                                arg2(isConfirm);
                            });
                        }, arg3 );
                    } else {
                        swal( arg1, arg2, arg3 );
                    }
                });
            },
            success: function(title, message) {
                $rootScope.$evalAsync(function(){
                    swal( title, message, 'success' );
                });
            },
            error: function(title, message) {
                $rootScope.$evalAsync(function(){
                    swal( title, message, 'error' );
                });
            },
            warning: function(title, message) {
                $rootScope.$evalAsync(function(){
                    swal( title, message, 'warning' );
                });
            },
            info: function(title, message) {    
                $rootScope.$evalAsync(function(){
                    swal( title, message, 'info' );
                });
            }
        };
        return self;
    }]);


})();
