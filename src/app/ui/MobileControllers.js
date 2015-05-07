var PS = require('./../ParticleSandbox');
var State = require('./../State');
var app = require('./');
/*@ngInject*/
app.controller("gravity", function Gravity($scope, settings) {
    $scope.settings = settings;
    $scope.view = "play";

    $scope.$watch('paused', function (newValue, oldValue) {
        $scope.settings.paused = newValue;
    });
    $scope.$watch('view', function (newValue, oldValue) {
        $scope.settings.paused = (newValue !== "play");
    });

    $scope.newInstance = function () {
        State.newInstance();
        State.clear();
    };

    $scope.setView = function (view) {
        $scope.view = view;
    };

});
