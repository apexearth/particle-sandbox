var PS = require('./../ParticleSandbox');
var settings = require('../settings');
var app = require('./');
/*@ngInject*/
app.controller("Main", function Main($scope, $http) {

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




    $scope.newInstance = function () {
        PS.newInstance();
        PS.clear();
    };

});
