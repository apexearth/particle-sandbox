var app = require('../');

var template =
    '<div class="psmenu-button" ng-click="action()" ng-class="class()">' +
    '<ng-transclude></ng-transclude>' +
    '</div>';

/*@ngInject*/
app.directive('psmenuButton', function () {
    return {
        restrict: 'E',
        template: template,
        transclude: true,
        scope: {
            view: '@'
        },
        controller: function ($scope, ui) {
            $scope.ui = ui;
            $scope.action = function () {
                if ($scope.view) ui.view($scope.view);
            };
            $scope.class = function () {
                return ui.view() === $scope.view ? 'psmenu-button-active' : '';
            };
        }
    };
});

