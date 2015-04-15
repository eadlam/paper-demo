'use strict';

/**
 * @ngdoc function
 * @name paperApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the paperApp
 */
angular.module('paperApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
