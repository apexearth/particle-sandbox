var app = require('../');
/*@ngInject*/
app.directive('psMenus', function(ui){
    return {
        restrict: 'E',
        templateUrl: 'app/ui/menus/ps-menus.html',
        link: function(scope) {
            scope.ui = ui;
        }
    };
});
