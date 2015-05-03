var Gravity = require('./../Gravity');
var app = require('./Application');
app.controller("gravity", ['$scope', '$http', function ($scope, $http) {
    $scope.paused = false;
    $scope.showTrail = true;
    $scope.trailType = 1;
    $scope.trailLifetime = 8;

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
        if(!Gravity.instance) return;
        Gravity.instance.Settings.paused = newValue;
    });
    $scope.$watch('showTrail', function (newValue, oldValue) {
        Gravity.setShowTrail(newValue);
    });
    $scope.$watch('trailType', function (newValue, oldValue) {
        Gravity.instance.Settings.trailType = newValue;
    });
    $scope.$watch('trailLifetime', function (newValue, oldValue) {
        Gravity.instance.Settings.trailLifetime = newValue;
    });

    $scope.togglePause = function () {
        $scope.paused = !$scope.paused;
    };

    $scope.initialize = function () {
        $scope.paused = Gravity.instance ? Gravity.instance.Settings.paused : true;
    };
    $scope.newInstance = function () {
        Gravity.newInstance();
        Gravity.clear();
        $scope.initialize();
    };

}]);
