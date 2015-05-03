﻿var Gravity = require('./../Gravity');
var app = require('./Application');
app.controller("gravity", ['$scope', function Gravity($scope) {
    $scope.paused = false;
    $scope.view = "play";

    $scope.$watch('paused', function (newValue, oldValue) {
        if (!Gravity.instance) return;
        Gravity.instance.Settings.paused = newValue;
    });
    $scope.$watch('view', function (newValue, oldValue) {
        $scope.paused = (newValue !== "play");
    });

    $scope.initialize = function () {
        $scope.paused = Gravity.instance.Settings.paused;
    };
    $scope.newInstance = function () {
        Gravity.newInstance();
        Gravity.clear();
        $scope.initialize();
    };

    $scope.setView = function (view) {
        $scope.view = view;
    };

}]);
