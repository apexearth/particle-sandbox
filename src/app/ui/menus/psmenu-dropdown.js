var app = require('../');
var template =
    '<div class="psmenu-button" ng-click="toggle()" ng-class="class()">' +
    '{{title}}' +
    '</div>' +
    '<ng-transclude ng-show="$parent.show() === name" style="position: absolute; margin-left: 80px; margin-top: -31px;"></ng-transclude>';

var dropDownId = 0;

/*@ngInject*/
app.directive('psmenuDropdown', function () {
    return {
        restrict: 'E',
        template: template,
        transclude: true,
        scope: {
            title: '@'
        },
        controller: function ($scope) {
            var $parent = $scope.$parent;
            $scope.name = 'psmenuDropdown' + dropDownId++;
            $scope.toggle = function () {
                $parent.show($scope.name);
            };
            $scope.class = function () {
                return $scope.isActive ? 'psmenu-button-active' : '';
            };

        }
    };
});
