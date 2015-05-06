var PS = require('./../ParticleSandbox');
var app = require('./');
/*@ngInject*/
app.controller("Main", ['$scope', '$http', function Main($scope, $http) {
    $scope.paused = false;
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


    $scope.$watch('paused', function (newValue, oldValue) {
        PS.instance.Settings.paused = newValue;
    });
    $scope.$watch('showTrail', function (newValue, oldValue) {
        PS.setShowTrail(newValue);
    });
    $scope.$watch('trailType', function (newValue, oldValue) {
        PS.instance.Settings.trailType = Number(newValue);
    });
    $scope.$watch('trailLifetime', function (newValue, oldValue) {
        PS.instance.Settings.trailLifetime = Number(newValue);
    });


    $scope.togglePause = function () {
        $scope.paused = !$scope.paused;
    };

    $scope.initialize = function () {
        $scope.paused = PS.instance ? PS.instance.Settings.paused : true;
    };
    $scope.newInstance = function () {
        PS.newInstance();
        PS.clear();
        $scope.initialize();
    };

}]);
