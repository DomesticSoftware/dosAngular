﻿var angularJSApp = angular.module('angularJSApp', ['ngRoute', 'angular-loading-bar']);


angularJSApp.config(function ($locationProvider, $routeProvider) {

    //$locationProvider.decorator('$sniffer', function ($delegate) {
    //    $delegate.history = false;
    //    return $delegate;
    //});

    $locationProvider.html5Mode(false);
    //$locationProvider.hashPrefix('!');
    
    $routeProvider
       .when('/', {
           templateUrl: '/Home/DashBoardIndex',
           controller: 'DashBoardCtrl'
        })
      .when('/Πελάτες', {
          templateUrl: '/Home/CustomersIndex',
          controller: 'CustomersIndexCtrl'
      })
      //.when('/tags/:tagId', {
      //    templateUrl: '/partials/template2.html',
      //    controller: 'ctrl2'
      //})
      //.otherwise({ redirectTo: '/DashBoard' }); //MvcAppBasic

});

angularJSApp.controller('bodyCtrl', function ($scope) {
    $scope.tmpBody = "hello there";    
});


angularJSApp.controller('homeCtrl', function ($scope) {
    //debugger;
});

angularJSApp.controller('CustomersIndexCtrl', function ($scope) {
    $scope.SelectCustomer = null
    $scope.SelectedDate = new Date();
    //debugger;
});

angularJSApp.controller('DashBoardCtrl', function ($scope) {
    //debugger;
});
