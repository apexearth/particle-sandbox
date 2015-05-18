var app = require('../');

var template =
    '<div class="psmenu-button" ng-click="action()" ng-class="class()">' +
    '{{title}}' +
    '</div>';

/*@ngInject*/
app.directive('psmenuButton', function () {
    return {
        restrict: 'E',
        template: template,
        transclude: true,
        scope: {
            menu: '@',
            title: '@'
        },
        controller: function ($scope) {
            var $parent = $scope.$parent;
            $scope.action = function () {
                if ($scope.menu) $parent.view($scope.menu);
            };
            $scope.class = function () {
                return $parent.view() === $scope.menu ? 'psmenu-button-active' : '';
            };

        }
    };
});
