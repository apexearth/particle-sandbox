var app = require('../');

var template =
    '<div class="psmenu-toggle"' +
    '     style="background-color: {{toggle && activecolor || inactivecolor}}"' +
    '     ng-class="{ \'psmenu-toggle-inactive\': !toggle, \'psmenu-toggle-active\': toggle }"' +
    '     ng-click="toggle = !toggle;">' +
    '<ng-transclude></ng-transclude>' +
    '</div>';

/*@ngInject*/
app.directive('psmenuToggle', function () {
    return {
        restrict: 'E',
        template: template,
        transclude: true,
        scope: {
            toggle: '=',
            activecolor: '@',
            inactivecolor: '@'
        }
    };
});

