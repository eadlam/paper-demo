'use strict';

/**
 * @ngdoc function
 * @name paperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the paperApp
 */
angular.module('paperApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
