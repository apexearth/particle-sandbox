var PS = require('./../ParticleSandbox');
var settings = require('../settings');
var app = require('./');
/*@ngInject*/
app.controller("Main", function Main($scope, $http) {
    $scope.showTrail = true;
    $scope.trailType = 2;
    $scope.trailLifetime = 4;

    $scope.showTutorial = localStorage.getItem("showTutorial") || true;
    $scope.tutorialIndex = 0;
    $http.get('json/tutorial.json').success(function (data) {
        $scope.tutorialData = data;
    });
    $scope.tutorialNext = function () {
        if ($scope.tutorialIndex++ >= $scope.tutorialData.length - 1)
            $scope.showTutorial = false;
    };
    $scope.tutorialDisable = function () {
        localStorage.setItem("showTutorial", false);
        $scope.showTutorial = false;
    };


    $scope.$watch('showTrail', function (newValue, oldValue) {
        PS.setShowTrail(newValue);
    });
    $scope.$watch('trailType', function (newValue, oldValue) {
        settings.trailType = Number(newValue);
    });
    $scope.$watch('trailLifetime', function (newValue, oldValue) {
        settings.trailLifetime = Number(newValue);
    });


    $scope.newInstance = function () {
        PS.newInstance();
        PS.clear();
    };

});
