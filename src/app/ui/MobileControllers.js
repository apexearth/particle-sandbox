var PS = require('./../ParticleSandbox');
var State = require('./../State');
var app = require('./');
/*@ngInject*/
app.controller("gravity", ['$scope', function Gravity($scope) {
    $scope.paused = false;
    $scope.view = "play";

    $scope.$watch('paused', function (newValue, oldValue) {
        if (!PS.instance) return;
        PS.instance.Settings.paused = newValue;
    });
    $scope.$watch('view', function (newValue, oldValue) {
        $scope.paused = (newValue !== "play");
    });

    $scope.initialize = function () {
        $scope.paused = Gravity.instance.Settings.paused;
    };
    $scope.newInstance = function () {
        State.newInstance();
        State.clear();
        $scope.initialize();
    };

    $scope.setView = function (view) {
        $scope.view = view;
    };

}]);
